const { events, Job } = require("brigadier");
events.on("exec", (e, p) => {
    console.log("Received push for commit " + e.revision.commit)
    var commit = e.revision.commit.substr(e.revision.commit.length - 7);
    commit = e.revision.commit.substring(0, 7);
    var greeting = new Job("job1", "alpine:latest");
    greeting.storage.enabled = true;
    greeting.tasks = [
        "echo Hello Pipeline",
        `echo correct output showing on terminal`

    ]
    var docker = new Job("job2" , "docker:dind");
    docker.privileged = true;
    docker.env = {
    DOCKER_DRIVER: "overlay"
    };
docker.tasks = [
    "dockerd-entrypoint.sh &",
    "sleep 10",
    "pwd",
    "cd /src/",
    "pwd",
    "ls -lart",
    "pwd",
    "docker build -t rahuldhus766/brigade:v5 .",
    "docker images",
]
   greeting.run();
   docker.run();

});


