#!/bin/sh

# test wrapper function
#CREATE OR REPLACE FUNCTION routerest_routing_wrapper(route jsonb) RETURNS jsonb AS
#$BODY$
#DECLARE
#    timeout float := 3;
#BEGIN
#    PERFORM pg_sleep(timeout);
#    RETURN route;
#END;
#$BODY$
#LANGUAGE plpgsql VOLATILE;
#select routerest_routing_wrapper(null);

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT
# start web server
npm start &

# allow the server to start
sleep 2

# test request
curl -X POST -H 'Content-Type: application/json' -d "@../request_example1.json" "http://localhost:8080/" > /dev/null
#curl -X POST -H 'Content-Type: application/json' -d "@../responce_example1.json" "http://localhost:8080/"

wait
