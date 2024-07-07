FROM postgres:latest

# Instalar locales e gerar pt_BR.UTF-8
RUN apt-get update && \
    apt-get install -y postgresql-client && \
    apt-get install -y locales && \
    locale-gen pt_BR.UTF-8 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN localedef -i pt_BR -c -f UTF-8 -A /usr/share/locale/locale.alias pt_BR.UTF-8


# Copiar o script SQL para um local conhecido dentro da imagem
#COPY bkp_tarrafa_db_2.sql /docker-entrypoint-initdb.d/
