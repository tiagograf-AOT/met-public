FROM python:3.8.5-buster

ARG DAGSTER_VERSION=0.17.6

RUN pip install --upgrade pip
# ==> Add Dagster layer
RUN \
    pip install \
        dagster==1.1.6 \
        dagster-postgres==0.17.6 \
        dagster-celery[flower,redis,kubernetes]==${DAGSTER_VERSION} \
        dagster-aws==${DAGSTER_VERSION} \
        dagster-k8s==${DAGSTER_VERSION} \
        dagster-celery-k8s==${DAGSTER_VERSION}

WORKDIR /opt/dagster/app

# Install the requirements
COPY ./requirements.txt .

RUN apt-get update && apt-get install -y git
RUN pip install --no-cache-dir -r requirements.txt

COPY src/etl_project/services/ /opt/dagster/app

# Run dagster gRPC server on port 4000

EXPOSE 4000

# CMD allows this to be overridden from run launchers or executors that want
# to run other commands against your repository
CMD ["dagster", "api", "grpc", "-h", "0.0.0.0", "-p", "4000", "-f", "repo.py"]
