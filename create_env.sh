aws elasticbeanstalk create-environment \
            --application-name hice_frontend \
            --environment-name hice-frontend-production \
            --solution-stack-name "64bit Amazon Linux 2023 v6.2.1 running Node.js 20" \
            --option-settings file://ebsconfig.json