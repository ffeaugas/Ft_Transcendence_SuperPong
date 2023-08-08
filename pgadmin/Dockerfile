FROM dpage/pgadmin4:7.4

RUN mkdir -p /var/lib/pgadmin/storage/admin_admin.fr
COPY ./pgpass /var/lib/pgadmin/storage/admin_admin.fr/
USER root
RUN chmod 600 /var/lib/pgadmin/storage/admin_admin.fr/pgpass

ENTRYPOINT ["/entrypoint.sh"]