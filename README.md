###Helmtool

A tool for automatic the tedious task of adding/removing value from helm yaml file. In cases when we have to add some env in
all helm values file it become a tedious task, helmtool helm in updating multiple helm file in one go.


### Installation.
1) Require node installation.
2) Install dependencies: 
     ```shell
      npm install
     ```
3) Link the app to your path:
     ```shell
      npm link
    ```

### Usage:
1) `helmtool --fileRegex="value" --add="server.ping.topic=journey-topic;server.pong.retry-topic=retry-topic-{env}" --root=yamlcli`
multiple values to be added can be pass by using `;` as separator. Key Value should be separated by `=`.

Initial Content
`value-sit.yaml`
```yaml
server:
  ping:
    a: b
    c: d
```
After running above command.
`value-sit.yaml`
```yaml
server:
  ping:
    a: b
    c: d
    topic: journey-topic
  pong:
    retry-topic: retry-topic-sit
```
Here `{env}` is replaced by `sit` for qa it will be automatically replaced by `qa`

In case you want to see what will be the content of yaml without updating the actual file use `--dryrun` argument with above command, the output will be printed to 
terminal.

`--root` is optional if not provided helmtool will look for file in current directory else it will look for file in provided `root` directory. 

If you want to do this change in specific file replace `--fileRegex` with `--file`,you can pass multiple `--file`.

2) `helmtool --fileRegex="value" --delete="server.ping.topic;server.pong.retry-topic" --root=yamlcli`