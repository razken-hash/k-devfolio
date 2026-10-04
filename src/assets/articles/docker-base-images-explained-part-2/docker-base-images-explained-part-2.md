# Docker Base Images Explained: A Comprehensive Guide — Part II

Continuing our journey through Docker base images, [Part I](/blog/docker-base-images-explained-part-1) explored **OS-based images** — **Full**, **Slim**, and **Alpine** — along with their advantages, trade-offs, and best use cases.

This naturally raises a more fundamental question:

> **Do we actually need a Linux distribution at all?**

In  **Part II** , we’ll move beyond traditional OS-based images and explore  **minimal images** , focusing on **Distroless** and  **Scratch** . We’ll examine their benefits, limitations, and best use cases, while also looking at **real-world examples and practical Dockerfiles** to understand when these minimal approaches make sense.

## 4. Distroless Images

**Distroless** images take the idea of minimal containers one step further.

Instead of starting with a general-purpose Linux distribution and removing unnecessary packages, Distroless images are designed to contain **only the runtime components and libraries needed to run an application**.

For example:

```dockerfile
FROM gcr.io/distroless/nodejs24
```

The name is intentional: **Distroless images contain no traditional Linux distribution userspace.**

However, **“Distroless” does not mean that the image contains no OS components at all**. Like any other container, it still relies on the host's Linux kernel and includes the libraries and files required for the application to run.

A typical Distroless image contains:

* **Required system libraries**
* **Application runtime** (Node.js, for example)
* **CA certificates and other essential runtime data**

What it generally does **not** contain:

* **Shell** such as `bash` or `sh`
* **Package manager**
* **Common Linux utilities**
* **Compilers**
* **Development and debugging tools**

This is one of the fundamental differences between Distroless and traditional OS-based images: **the image contains what the application needs to run, but removes the tools you would normally use to inspect or modify the environment interactively.**

### Advantages

The main advantage of Distroless is **minimalism at runtime**.

* Very small runtime images
* Fewer packages to maintain
* Fewer unnecessary components which reduce the attack surface

The philosophy is simple:

> **If your application doesn't need it to run, don't put it in the runtime image.**

### Disadvantages

The same minimalism that makes Distroless attractive can also make it less convenient.

* No shell for interactive debugging
* No package manager
* No common troubleshooting utilities
* Missing tools cannot simply be installed at runtime
* Application dependencies need to be understood beforehand
* Debugging requires different techniques and better observability

For example, this familiar command won't work with a standard Distroless image:

```bash
docker exec -it my-app sh
```

because there is no `sh` to execute.

This changes how you operate and troubleshoot the container. Instead of relying on tools inside the container, you should rely more on **logs([Kibana](https://www.elastic.co/kibana/)), metrics ([Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/)), health checks ([Consul](https://developer.hashicorp.com/consul)), and external debugging techniques**.

### When should you use it?

Distroless images are particularly well suited for:

* **Production workloads**
* **Mature applications with well-understood runtime dependencies**
* **Microservices Architectures**
* **Immutable container environments**
* **Workloads where minimizing image size and runtime components can reduce cloud storage and image transfer costs** (e.g., AWS)

They are especially interesting when combined with **multi-stage builds**, where only the required dependencies and application artifacts are copied between stages:

* **First Stage (Build):** Uses an OS-based image containing everything required to install dependencies, compile, build, and package the application.
* **Second Stage (Runtime):** Uses a minimal Distroless image containing only the application and runtime dependencies required to run it.

It is a strong fit when your mindset is:

> **“Build with everything I need, but run with only what I need.”**

However, this raises an even more fundamental question:

> **What if we don't need a runtime environment at all?**

What if the application is already a **self-contained executable** and requires nothing beyond the host kernel?

That's where we reach the extreme end of our spectrum: **Scratch images**.

## 5. Scratch Images

**Scratch** is the most minimal starting point available in Docker.

Unlike all the previous types of images, `scratch` doesn't provide a Linux userspace or any system utilities.

It is essentially an **empty image** and it literrally does not contain any OS components.

```dockerfile
FROM scratch
```

This means Docker starts with an **empty filesystem**, so your application and every file it requires at runtime must be explicitly added to the image.

### Advantages

Scratch provides the ultimate level of minimalism.

* Extremely small image
* Almost no unnecessary components
* No package manager, shell or any system utilities
* Very small attack surface at the image-content level

### Disadvantages

This extreme level of minimalism comes with significant limitations:

* **No standard userspace**, including shells, package managers, or common Linux utilities
* **No application runtime or system libraries**
* **Considerably more difficult debugging**, since there are no built-in tools for inspecting or troubleshooting the container
* **Limited compatibility** with applications that rely on dynamically linked libraries
* **Greater responsibility for the image builder**, as every required runtime component must be identified and included

For example, a dynamically linked application cannot simply be copied into `scratch` and expected to work if its required libraries aren't present.

This is why Scratch is particularly associated with **statically compiled applications**.

### When should you use it?

Scratch is best suited for applications that are **self-contained and do not require a traditional Linux userspace at runtime**. Typical use cases include:

* **Statically compiled applications**
* **Small Go services**
* **Minimal command-line applications**
* **Security-sensitive production workloads** where the application can run without a userspace
* **Highly controlled container environments**
* Workloads where achieving the **smallest possible runtime image** is a priority

A classic example is a statically compiled Go application:

```dockerfile
FROM golang:1.25 AS builder

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 go build -o my-app .

FROM scratch AS runner

COPY --from=builder /app/my-app /my-app

ENTRYPOINT ["/my-app"]
```

The first stage contains the Go toolchain and everything required to build the application. The final stage contains essentially just the resulting binary.

However, Scratch is not simply the **“best” version of Distroless**. Its extreme minimalism also means that **you are responsible for providing everything the application requires at runtime**.

The goal should therefore not be:

> **“How small can I make my image?”**

A better question is:

> **“What is the minimum environment my application actually needs to run?”**

For some applications, that minimum may be a **Full** Linux userspace. For others, it may be **Slim** or **Alpine**. For a statically compiled binary with no additional runtime requirements, it might be nothing more than **Scratch**.

And that brings us to the real goal of choosing a Docker base image: **finding the right balance between minimalism, compatibility, security, and operational simplicity.**
