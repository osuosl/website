---
title: POWER Development Hosting
---

The Open Source Lab partners with [IBM](https://www.ibm.com/power) to give open source projects free access to
[POWER](https://en.wikipedia.org/wiki/IBM_Power_microprocessors)-based systems. We host more than 150 projects and
academic partners on POWER9 and POWER10 hardware, from Linux distributions such as Debian, Fedora, AlmaLinux and Rocky
Linux to compilers and runtimes such as LLVM, Go and OpenJDK, and scientific software such as NumPy, SciPy and PyTorch.
We also work with the [OpenPOWER Foundation](https://openpowerfoundation.org/), whose HUB systems we host for GPU
workloads.

Projects use these systems to build, test and support their software on the ppc64le architecture. Developers looking for
assistance can go to IBM's [Linux on Systems documentation](https://www.ibm.com/docs/en/linux-on-systems).

- List of [Current Projects & Academic Partners](/services/powerdev/current-projects)
- List of [Former Projects & Academic Partners](/services/powerdev/former-projects)

We host two kinds of POWER resources at the Open Source Lab:

## OpenStack

Our OpenStack cluster offers POWER9 & POWER10 LE instances running on KVM and
providing access via OpenStack's API and GUI interface. These shared systems are intended for functional development and
continuous integration work, but are not ideal for performance testing. We start projects out with a small quota, but
can increase given resource availability and justification.

To request access to an OpenStack POWER instance, use our
[OpenPOWER OpenStack request form](/services/powerdev/request-hosting).

### POWER Continuous Integration (POWER CI)

Hosted via the OpenStack cluster is an OSL managed Jenkins service which is hosted at <https://powerci.osuosl.org>. This
service is intended to allow projects easier access to the POWER architecture via Jenkins.

Users can request access to register one or more GitHub repositories on the Jenkins server, where they can configure the
build process and the environment as needed. Builds run in Docker containers. Users can also configure the system to run
their tests, package any necessary files and binaries after running the build, and archive the build artifacts on the
Jenkins server for later access. The service also supports providing e-mail notifications on build status and embedded
build-notification for webpages.

To request access to the POWER CI service, use our [POWER CI request form](/services/powerdev/request-ci).

## GPU

We also host the OpenPOWER Foundation HUB systems, which offer POWER9 AC922 servers with NVIDIA V100 GPUs connected via
NVLink. These systems are hosted by the OSUOSL in collaboration with the [OpenPOWER Foundation HUB
SIG](https://openpowerfoundation.org/hub/), and all new GPU projects are directed there. To request access to the
OpenPOWER GPU cluster, use the [OpenPOWER Foundation HUB SIG
form](https://openpowerfoundation.org/hub/oregonstateuniversity/).
