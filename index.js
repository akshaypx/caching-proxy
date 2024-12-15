const { Command } = require("commander");
const { log } = require("console");
const http = require("http");
const fs = require("fs");
const program = new Command();

//fetch response
const getResponse = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (e) {
    return e;
  }
};

//defining the program
program
  .name("caching-proxy")
  .description("Cache requests from a server.")
  .version("0.0.0");

//defining options
// program
//   .command("caching-proxy")
//   .option("-c, --clear-cache <url>", "this will clear the server cache")
//   .action((options) => {
//     log("Delete file cache");
//   });

program
  .command("caching-proxy")
  .option(
    "-p, --port <number>",
    "the port on which the caching proxy server will run"
  )
  .option(
    "-o, --origin <url>",
    "the URL of the server to which the requests will be forwarded"
  )
  .option("-c, --clear-cache", "this will clear the server cache")
  .action((options) => {
    if (options.port && options.origin) {
      console.log(
        `This is the entered port-${options.port}, and url-${options.origin}`
      );

      const port = options.port;

      const server = http.createServer(async (req, res) => {
        const receivedUrl = req.url;
        const baseUrl = options.origin;

        log(receivedUrl);

        if (fs.existsSync("data/cache.json")) {
          let file = JSON.parse(fs.readFileSync("data/cache.json", "utf-8"));

          if (receivedUrl in file) {
            log("Present");
            res.setHeader("X-Cache", "HIT");
            res.end(JSON.stringify(file[receivedUrl]));
          } else {
            log("Not Present");
            res.setHeader("X-Cache", "MISS");
            const response = await getResponse(baseUrl + receivedUrl);

            let content = { ...file };
            content[receivedUrl] = response;
            jsonContent = JSON.stringify(content);

            fs.writeFile("data/cache.json", jsonContent, async (err) => {
              if (err) log("Error while fetching ", receivedUrl, err);
              else {
                await response;
                res.end(JSON.stringify(response));
              }
            });
          }
        } else {
          //file does not exist
          res.setHeader("X-Cache", "MISS");
          const response = await getResponse(baseUrl + receivedUrl);
          let content = {};
          content[receivedUrl] = response;
          jsonContent = JSON.stringify(content);

          fs.writeFile("data/cache.json", jsonContent, async (err) => {
            if (err) log("Error while fetching ", receivedUrl, err);
            else {
              await response;
              res.end(JSON.stringify(response));
            }
          });
        }
      });

      server.listen(port, (error) => {
        if (error) {
          log("Error-", error);
        } else {
          log("Listening on port 3000");
        }
      });
    } else if (options.clearCache) {
      if (fs.existsSync("data/cache.json")) {
        fs.unlinkSync("data/cache.json");
        log("Cache cleared!");
      } else {
        log("Cache already cleared!");
      }
    } else {
      log("Please check help for details.");
    }
  });

program.parse();
