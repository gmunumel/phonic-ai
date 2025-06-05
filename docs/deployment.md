# Deployment steps

1. Create an EKS Cluster

   ```
   eksctl create cluster \
   --name phonic-ai-cluster \
   --region eu-central-1 \
   --nodes 2 \
   --node-type t3.small
   ```

2. Install AWS Load Balancer Controller

   a. Associate IAM OIDC provider (if not already):

   ```
   eksctl utils associate-iam-oidc-provider --region eu-central-1 --cluster phonic-ai-cluster --approve
   ```

   b. Create IAM policy for the controller:

   ```
   curl -o iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.6.2/docs/install/iam_policy.json

   aws iam create-policy \
   --policy-name AWSLoadBalancerControllerIAMPolicy \
   --policy-document file://iam-policy.json
   ```

   c. Create a service account for the controller:

   ```
   eksctl create iamserviceaccount \
   --cluster=phonic-ai-cluster \
   --namespace=kube-system \
   --name=aws-load-balancer-controller \
   --attach-policy-arn=arn:aws:iam::177539010329:policy/AWSLoadBalancerControllerIAMPolicy \
   --approve
   ```

   d. Install the controller using Helm:

   ```
   helm repo add eks https://aws.github.io/eks-charts
   helm repo update

   helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
   -n kube-system \
   --set clusterName=phonic-ai-cluster \
   --set serviceAccount.create=false \
   --set serviceAccount.name=aws-load-balancer-controller \
   --set region=eu-central-1 \
   --set vpcId=vpc-00975b967bd4e6289 \
   --set image.tag="v2.13.2"
   ```

   **Notice**: the value `vpcId` must target your created vpc and not the default one.

3. Verify Installation

   ```
   kubectl get deployment -n kube-system aws-load-balancer-controller
   ```

4. Push Docker Images to ECR

   a. Create ECR repositories (if not already done):

   ```
   aws ecr create-repository --repository-name phonic-ai-backend
   aws ecr create-repository --repository-name phonic-ai-frontend
   ```

   b. Build, tag, and push images (repeat for each service):

   **Authenticate Docker to ECR**:

   ```
   aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 177539010329.dkr.ecr.eu-central-1.amazonaws.com
   ```

   **Build and push backend**:

   ```
   docker build -t phonic-ai-backend -f backend/Dockerfile .
   docker tag phonic-ai-backend:latest 177539010329.dkr.ecr.eu-central-1.amazonaws.com/phonic-ai-backend:latest
   docker push 177539010329.dkr.ecr.eu-central-1.amazonaws.com/phonic-ai-backend:latest
   ```

   **Repeat for frontend**:

   ```
   docker build -t phonic-ai-frontend -f frontend/Dockerfile .
   docker tag phonic-ai-frontend:latest 177539010329.dkr.ecr.eu-central-1.amazonaws.com/phonic-ai-frontend:latest
   docker push 177539010329.dkr.ecr.eu-central-1.amazonaws.com/phonic-ai-frontend:latest
   ```

5. Deploy with Helm

   ```
   helm install phonic-ai ./phonic-ai-chart
   # or upgrade
   helm upgrade --install phonic-ai ./phonic-ai-chart
   ```

6. Access Your App

   a. The AWS ALB Ingress Controller will provision a public load balancer.

   b. Find the DNS name:

   ```
   kubectl get ingress
   ```

## Thoubleshooting

### ADDRESS is not defined

1. Check the Ingress Controller

   ```
   kubectl get pods -n kube-system | grep aws-load-balancer-controller
   ```

   You should see at least one pod in Running state.

2. Check Events

   ```
   kubectl describe ingress phonic-ai-ingress
   ```

3. Once ADDRESS is populated

   hen the ADDRESS column shows a DNS name (like xxxx.elb.amazonaws.com), you can visit:

   ```
   http://<that-dns-name>
   ```

### In case of problems

See k8s logs for aws-load-balancer-controller:

```
kubectl logs -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller
kubectl describe ingress phonic-ai-ingress
```

Re-deploy the AWS Load Balancer Controller:

```
kubectl delete pod -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller
```

List my VPCs:

```
aws ec2 describe-vpcs --query "Vpcs[*].{ID:VpcId,CIDR:CidrBlock}" --output table
```

Display Default VPC:

```
aws ec2 describe-vpcs \
  --filters Name=isDefault,Values=true \
  --query "Vpcs[*].{ID:VpcId, CIDR:CidrBlock}" \
  --output table
```

VPC used by EKS:

```
aws ec2 describe-vpcs \
  --filters "Name=tag:Name,Values=*eks*" \
  --query "Vpcs[*].{ID:VpcId, CIDR:CidrBlock, Tags:Tags}" \
  --output table
```

### Step-by-Step Debugging

1. Check Frontend Pod Status

   ```
   kubectl get pods
   ```

2. Check Frontend Service

   ```
   kubectl get svc
   ```

3. Check Pod Logs

   ```
   kubectl logs frontend-658574d684-v9prv
   ```

4. Explore file system in a pod

   ```
   kubectl exec -it frontend-bb8868dc7-7574z -- /bin/sh
   ```

## Useful commands

### Rollout Restart

This will forced a restart for a pod:

```
kubectl rollout restart deployment frontend
kubectl rollout restart deployment backend
```

### Configure nginx in deployed Frontend

First connec to deployed frontend

```
kubectl exec -it frontend-6c954dd45d-xxmxd -- /bin/sh
```

Edit `nginx` file:

```
vi /etc/nginx/conf.d/default.conf
```

Restart nginx

```
nginx -s reload
```
