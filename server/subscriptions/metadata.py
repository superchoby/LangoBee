from dataclasses import dataclass
from .features import (
    MONTHLY_SUBSCRIPTION_MESSAGE,
    YEARLY_SUBSCRIPTION_MESSAGE,
    LIFETIME_SUBSCRIPTION_MESSAGE
)
from typing import Optional
import os

isInProdEnviron = 'SECRET_KEY' in os.environ

@dataclass
class SubscriptionPrices(object):
    """
    Metadata for a Stripe product.
    """
    price_id: str
    name: str
    description: str
    cost: int
    price_message: Optional[int] = None

MONTHLY = SubscriptionPrices(
    price_id='price_1N3QjHC2AOxUnvraAP31PaVG' if isInProdEnviron else 'price_1N3h1JC2AOxUnvraAihwjF0j',
    name='Monthly',
    description=MONTHLY_SUBSCRIPTION_MESSAGE,
    cost=4.99,
)

ANNUAL = SubscriptionPrices(
    price_id='price_1N3QjHC2AOxUnvra2GhFSPpy' if isInProdEnviron else 'price_1N3h1JC2AOxUnvraBQpfgcI7',
    name='Annual',
    description=YEARLY_SUBSCRIPTION_MESSAGE,
    cost=49.99,
    price_message='20% Off'
)

LIFETIME = SubscriptionPrices(
    price_id='price_1N3QjHC2AOxUnvra02msVlBq' if isInProdEnviron else 'price_1N3hOxC2AOxUnvraj2QETExb',
    name='Lifetime',
    description=LIFETIME_SUBSCRIPTION_MESSAGE,
    cost=119.99,
    price_message='Best Value'
)
