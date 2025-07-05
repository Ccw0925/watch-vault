# To deploy backend
gcloud run deploy watch-vault --source . --region=asia-southeast1 --set-secrets="FIREBASE_CREDENTIALS_JSON=firebase-service-account:latest"