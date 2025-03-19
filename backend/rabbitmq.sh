#!/bin/bash
set -e

rabbitmq-server -detached

# until rabbitmqctl status >/dev/null 2>&1; do
#   echo "Aguardando o RabbitMQ iniciar..."
# done

# until rabbitmqctl eval 'rabbit:is_running().' | grep -q "true"; do
#   echo "Aguardando o aplicativo 'rabbit' iniciar completamente..."
# done

# echo "RabbitMQ iniciado, criando vhost..."

rabbitmqctl add_vhost vhost

rabbitmqctl set_permissions -p vhost guest ".*" ".*" ".*"

# echo "Vhost 'meu_vhost' criado com sucesso!"

# rabbitmqctl stop

exec rabbitmq-server
