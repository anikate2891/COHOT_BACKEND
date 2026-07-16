- Kubernetevs , Kubernetevs Support, Docker, YAML

- NPM's
    - docker build . -t <image_name>:latest [image creation]
    - docker run -p 3000:3000 <image_name> [image running and changing into a container]
    - docker ps
    - docker stop <container_id>
    : with that we have an Image of our application running in a docker container.

    - Kubearnetes
        - Ceate code -  kubectl apply -f <folder_path> [./k8s/deployment.yml]
        - Ingress Controller Setup:
            - kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
        - Metric Api Server Setup:
            - kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
        - After rebuild image, restart the deployment:
            - kubectl rollout restart deployment/<deployment_name> [express-deployment]
        - Work with React & Need to create a new POD:
            - package(npm i) - @kubernetes/client-node / uuid
