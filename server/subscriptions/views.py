from rest_framework.views import APIView
from rest_framework.response import Response
import stripe
from .metadata import MONTHLY, ANNUAL, LIFETIME
import os
import dataclasses, json
from rest_framework import permissions, status
from users.models import User
from .models import Subscription
import datetime
from datetime import timedelta
from django.utils import timezone
import time
from django.conf import settings

domain = 'https://www.langobee.com' if settings.IS_IN_PROD_ENVIRON else 'http://localhost:3000'
CHECKOUT_SUCCESS_URL = domain + '/checkout?session_id={CHECKOUT_SESSION_ID}'
CHECKOUT_CANCEL_URL = domain + '/subscription'
class EnhancedJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if dataclasses.is_dataclass(o):
            return dataclasses.asdict(o)
        return super().default(o)

def insert_decimal(number):
    if number < 100:
        raise ValueError("Number must have at least 3 digits")

    str_number = str(number)
    last_three_digits = str_number[-2:]
    rest_of_number = str_number[:-2]

    return f"{rest_of_number}.{last_three_digits}"

class PricesView(APIView):
    def get(self, request):
        proration_info = {}
        if request.user.subscription is not None and request.user.subscription.subscription_plan != 'Lifetime':
            proration_date = int(time.time())
            subscription = stripe.Subscription.retrieve(request.user.subscription.stripe_subscription_id)
            items=[{
                'id': subscription['items']['data'][0].id,
                'price': ANNUAL.price_id, # Switch to new price
            }]
            invoice = stripe.Invoice.upcoming(
                customer=request.user.subscription.stripe_customer_id,
                subscription=request.user.subscription.stripe_subscription_id,
                subscription_items=items,
                subscription_proration_date=proration_date,
            )
            proration_info['Annual'] = insert_decimal(invoice['total'])
            period_left_for_subscription = (request.user.subscription.end_date - timezone.now()).days / (request.user.subscription.end_date - request.user.subscription.start_date).days
            proration_info['Lifetime'] = str(round(period_left_for_subscription * LIFETIME.cost, 2))

        return Response(json.dumps({
            'monthly': MONTHLY,
            'annual': ANNUAL,
            'lifetime': LIFETIME,
            'proration_info': proration_info
        }, cls=EnhancedJSONEncoder))

class UserStripeInfo(APIView):
    def post(self, request):
        data = request.data
        email = data['email']
        payment_method_id = data['payment_method_id']
        
        # creating customer
        customer = stripe.Customer.create(
        email=email, payment_method=payment_method_id)
        
        return Response(status=status.HTTP_200_OK, 
                    data={
                        'message': 'Success', 
                        'data': {'customer_id': customer.id}   
                    }
                )                                                        

class StripeCheckout(APIView):
    def post(self, request):
        
        subscription_type = request.data['subscription_type']

        # subscriptions = stripe.Subscription.list(price=price_info['id'], customer=session['customer'])['data']
        #             if len(subscriptions) > 1:
        #                 ("User has multiple subscriptions which shouldn't be the case")
        customer_arguments = {}
        if request.user.subscription is None:
            customer_arguments = {'customer_email': request.user.email}
            if subscription_type == 'Lifetime':
                customer_arguments['customer_creation'] = 'always' # can't automatically just set this to always in any case, doesn't work in case of monthly/annual subscriptions
        else :
            customer_arguments = {'customer': request.user.subscription.stripe_customer_id}

        custom_text = f'This is for the {subscription_type} subscription' if f'This is for the {subscription_type} subscription' != 'Lifetime' else 'This is for the one time payment only Lifetime subscription'
        try:
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price': request.data['price_id'],
                        'quantity': 1,
                    },
                ],
                mode='subscription' if subscription_type != 'Lifetime' else 'payment',
                success_url=CHECKOUT_SUCCESS_URL,
                cancel_url=CHECKOUT_CANCEL_URL,
                custom_text={'submit': {'message': custom_text}},
                consent_collection={
                    'terms_of_service': 'required',
                },
                **customer_arguments,
            )
            return Response({'redirect_path': checkout_session.url})
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SuccessfulCheckoutView(APIView):
    def post(self, request):
        session = None
        try:
            session = stripe.checkout.Session.retrieve(request.data['session_id'], expand = ['line_items'])
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        purchased_plan_info = session['line_items']['data'][0]
        price_info = purchased_plan_info['price']
        response = { 'subscription_type': price_info['nickname'] }

        if (price_info['type'] == 'recurring'):
            subscriptions = stripe.Subscription.list(price=price_info['id'], customer=session['customer'])['data']
            response['end_date'] = timezone.make_aware(datetime.datetime.fromtimestamp(subscriptions[0]['current_period_end']))

        return Response(response, status=status.HTTP_200_OK)
        
class UsersSubscriptionInfo(APIView):
    def get(self, request):
        subscription_type = None
        if request.user.subscription is not None:
            subscription_type = request.user.subscription.subscription_plan
        else:
            now = timezone.now()
            seven_days_ago = now - timedelta(days=7)
            if request.user.date_joined >= seven_days_ago:
                subscription_type = 'Free Trial'

        return Response({
            'subscription_type': subscription_type
        }, status=status.HTTP_200_OK)

class UpgradeSubscriptionView(APIView):
    def post(self, request):
        subscription = stripe.Subscription.retrieve(request.user.subscription.stripe_subscription_id)
        stripe.Subscription.modify(
            subscription.id,
            cancel_at_period_end=False,
            proration_behavior='create_prorations',
            items=[{
                'id': subscription['items']['data'][0].id,
                'price': request.data['price_id'],
            }]
        )

        # return Response({'redirect_path': checkout_session.url})
        return Response(status=status.HTTP_200_OK)

class StripeWebhook(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Replace this endpoint secret with your endpoint's unique secret
        # If you are testing with the CLI, find the secret by running 'stripe listen'
        # If you are using an endpoint defined with the API or dashboard, look in your webhook settings
        # at https://dashboard.stripe.com/webhooks
        try:
            webhook_secret = None
            request_data = request.data

            if webhook_secret:
                # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.
                signature = request.headers.get('stripe-signature')
                try:
                    event = stripe.Webhook.construct_event(
                        payload=request.data, sig_header=signature, secret=webhook_secret)
                    data = event['data']
                except Exception as e:
                    print(e)
                    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                # Get the type of webhook event sent - used to check the status of PaymentIntents.
                event_type = event['type']
            else:
                data = request_data['data']
                event_type = request_data['type']
            data_object = data['object']

            # print('event ' + event_type)
            if event_type == 'checkout.session.completed':
                session = stripe.checkout.Session.retrieve(data_object['id'], expand = ['line_items'])
                purchased_plan_info = session['line_items']['data'][0]
                price_info = purchased_plan_info['price']
                stripe_subscription_id = None
                end_date = None
                start_date = None
                if price_info['type'] == 'one_time':
                    start_date = datetime.date.today()
                    end_date = timezone.make_aware(timezone.datetime.max, timezone.get_default_timezone())
                else: # Is recurring
                    subscriptions = stripe.Subscription.list(price=price_info['id'], customer=session['customer'])['data']
                    start_date = timezone.make_aware(datetime.datetime.fromtimestamp(subscriptions[0]['current_period_start']))
                    end_date = timezone.make_aware(datetime.datetime.fromtimestamp(subscriptions[0]['current_period_end']))
                    stripe_subscription_id = subscriptions[0]['id']
                
                subscription, _ = Subscription.objects.update_or_create(
                    subscription_plan = price_info['nickname'],
                    stripe_price_id = price_info['id'],
                    stripe_subscription_id = stripe_subscription_id,
                    start_date = start_date,
                    end_date = end_date,
                    status = 'active',
                    stripe_customer_id = session['customer'],
                )

                user = User.objects.get(email=data_object['customer_details']['email'])
                user.subscription = subscription
                user.save()

                print('🔔 Payment succeeded!')
            elif event_type == 'invoice.paid':
                pass
            elif event_type == 'customer.subscription.updated':
                subscription = Subscription.objects.get(stripe_customer_id=data_object['customer'])
                purchased_plan_info = data_object['items']['data'][0]
                subscription.subscription_plan = purchased_plan_info['plan']['nickname']
                subscription.stripe_price_id = purchased_plan_info['plan']['id']
                subscription.end_date = timezone.make_aware(datetime.datetime.fromtimestamp(data_object['current_period_end']))
                subscription.status = 'active'
                subscription.save()

            elif event_type == 'customer.subscription.deleted':
                subscription_data = data_object
                Subscription.objects.get(stripe_subscription_id=subscription_data['id']).delete()

                # print('Subscription canceled: %s', event.id)
            
            return Response({'status': 'success'})
        
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)