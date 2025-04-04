---
title: POWER Development Hosting
slug: /powerdev
---

The Open Source Lab partners with [IBM](http://www-03.ibm.com/linux/ltc/) to host
[POWER](http://en.wikipedia.org/wiki/IBM_POWER_microprocessors) based servers in order to provide an open platform for
innovation to the open source community. Current projects embrace open software projects ranging from KVM to OpenStack
and open collaboration with [OpenPOWER Foundation](http://openpowerfoundation.org) partners, including
[NVIDIA](http://www.nvidia.com), [Mellanox](https://www.mellanox.com), [Ubuntu](http://www.ubuntu.com) and
[Google](https://opensource.google.com/), and open source based ISV and distribution partners, such as
[Chef](https://www.chef.io/chef/), Red Hat, SUSE and Ubuntu, who support the latest POWER hardware via production and
development (Fedora, CentOS, OpenSUSE, and Debian) distributions.

Members of the community can use these POWER servers to develop and test open source projects on the
[Power Architecture](http://en.wikipedia.org/wiki/Power_Architectur) platform and in a
[PowerLinux](http://en.wikipedia.org/wiki/PowerLinux) environment. Developers looking for assistance can go to the
[Linux on IBM Power Systems Developer](https://developer.ibm.com/linuxonpower/) portal or
[IBM Portal for OpenPOWER](https://www-355.ibm.com/systems/power/openpower/).

- List of [Current Projects & Academic Partners](/services/powerdev/current-projects)
- List of [Former Projects & Academic Partners](/services/powerdev/former-projects)

Two clusters of POWER resources are hosted at the Open Source Lab:

## OpenStack

The first cluster is an OpenStack based cluster offering POWER8, POWER9, & POWER10 LE instances running on KVM and
providing access via OpenStack's API and GUI interface. These shared systems are intended for functional development and
continuous integration work, but are not ideal for performance testing. We start projects out with a small quota, but
can increase given resource availability and justification.

To request access to an OpenStack POWER instance, use our
[OpenPOWER OpenStack request form](/services/powerdev/request_hosting).

### POWER Continuous Integration (POWER CI)

Hosted via the OpenStack cluster is an OSL managed Jenkins service which is hosted at <https://powerci.osuosl.org>. This
service is intended to allow projects easier access to the POWER architecture via Jenkins.

Users can request access to register one or more GitHub repositories on the Jenkins server, where they can configure the
build process and the environment as needed. Builds will run in a Docker container by default, but can also be run in a
virtual machine if need be. Users can also configure the system to run their tests, package any necessary files and
binaries after running the build, and archive the build artifacts on the Jenkins server for later access. The service
also supports providing e-mail notifications on build status and embedded build-notification for webpages.

To request access to the POWER CI service, use our [POWER CI request form](/services/powerdev/request_powerci).

## GPU

The second cluster is an OpenPOWER GPU based acceleration cluster offering POWER9 AC922 servers with NVIDIA V100 GPUs
connected via NVLink. This cluster is hosted by the OSUOSL via a collaborate with the
[OpenPOWER Foundation HUB SIG](https://openpower.foundation/hub/). To request access to the OpenPOWER GPU cluster, use
the [OpenPOWER Foundation HUB SIG form](https://openpower.foundation/hub/oregonstateuniversity/).
