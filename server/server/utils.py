from django.contrib.auth import authenticate
import json
# import jwt
import requests

def jwt_get_username_from_payload_handler(payload):
    print('jwt_get_username_from_payload_handler')
    print('jwt_get_username_from_payload_handler')
    print('jwt_get_username_from_payload_handler')
    print('jwt_get_username_from_payload_handler')
    print('jwt_get_username_from_payload_handler')
    print('jwt_get_username_from_payload_handler')
    print('jwt_get_username_from_payload_handler')
    print('jwt_get_username_from_payload_handler')
    print('jwt_get_username_from_payload_handler')
    print('jwt_get_username_from_payload_handler')
    print('jwt_get_username_from_payload_handler')
    print('jwt_get_username_from_payload_handler')
    print('jwt_get_username_from_payload_handler')
    print('jwt_get_username_from_payload_handler')
    print('jwt_get_username_from_payload_handler')
    username = payload.get('sub').replace('|', '.')
    authenticate(remote_user=username)
    return username

def jwt_decode_token(token):
    print('jwt_decode_token')
    print('jwt_decode_token')
    print('jwt_decode_token')
    print('jwt_decode_token')
    print('jwt_decode_token')
    print('jwt_decode_token')
    print('jwt_decode_token')
    print('jwt_decode_token')
    print('jwt_decode_token')
    print('jwt_decode_token')
    print('jwt_decode_token')
    print('jwt_decode_token')
    print('jwt_decode_token')
    print('jwt_decode_token')
    header = jwt.get_unverified_header(token)
    jwks = requests.get('https://{}/.well-known/jwks.json'.format('dev-qjlrgux8wf1cl3jf.us.auth0.com')).json()
    public_key = None
    for jwk in jwks['keys']:
        if jwk['kid'] == header['kid']:
            public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

    if public_key is None:
        raise Exception('Public key not found.')

    issuer = 'https://{}/'.format('dev-qjlrgux8wf1cl3jf.us.auth0.com')
    return jwt.decode(token, public_key, audience='http:127.0.0.1', issuer=issuer, algorithms=['RS256'])