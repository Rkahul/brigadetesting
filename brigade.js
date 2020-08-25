const { events, Job } = require("brigadier");
events.on("push", (e, p) => {
    console.log("Received push for commit " + e.revision.commit)
    var commit = e.revision.commit.substr(e.revision.commit.length - 7);
    commit = e.revision.commit.substring(0, 7);
    var greeting = new Job("job1", "alpine:latest");
    greeting.storage.enabled = true;
    greeting.tasks = [
        "echo Hello Pipeline",
        `echo commit id is ${commit}`

    ]
    var docker = new Job("job2" , "docker:dind");
    docker.privileged = true;
    docker.env = {
    DOCKER_DRIVER: "overlay"
    };
docker.tasks = [
    "dockerd-entrypoint.sh &",
    "sleep 10",
    "cd /src/",
    "pwd",
    "ls -lart",
    "pwd",
    "docker build -t rahuldhus766/brigade:{commit} .",
    "docker images",
    "docker login --username=rahuldhus766"
]
   greeting.run();
   docker.run();

});


