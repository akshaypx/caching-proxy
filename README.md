"https://roadmap.sh/projects/caching-server"

## Commands
- To start server run

```
caching-proxy --port <number> --origin <url>
```
```--port``` is the port on which the caching proxy server will run.

```--origin``` is the URL of the server to which the requests will be forwarded.

- Clear the cache by running a command like following
```
caching-proxy --clear-cache
```

- About the response
```
# If the response is from the cache
X-Cache: HIT

# If the response is from the origin server
X-Cache: MISS
```

### Example
```
caching-proxy --port 3000 --origin http://dummyjson.com
```
