---
title: IBM Z Development Hosting
slug: /ibm-z
---

The Open Source Lab partners with [Marist College](http://www.marist.edu/), who has a long-standing relationship with
[IBM](https://www.ibm.com/us-en/), to provide access to [IBM Z](https://en.wikipedia.org/wiki/IBM_Z) based servers for
the open source community.  With this partnership, the Open Source Lab is able to offer continuous integration services
via Jenkins allowing open source projects to build and test on the s390x architecture.  More information about running
Linux on IBM Z can be found at IBM's [Linux on IBM Z
community](https://www.ibm.com/developerworks/community/groups/community/lozopensource).

### IBM Z Continuous Integration (IBM Z CI)

An OSL-managed Jenkins service is hosted at https://ibmz-ci.osuosl.org. This service is intended to allow projects
easier access to the s390x architecture via Jenkins.

Users can request access to register one or more GitHub repositories on the Jenkins server, where they can configure the
build process and the environment as needed. Builds will run in a Docker container. Users can also configure the system
to run their tests, package any necessary files and binaries after running the build, and archive the build artifacts on
the Jenkins server for later access. The service also supports providing e-mail notifications on build status and
embedded build-notification for webpages.

To request access to the IBM Z CI service, use our [IBM Z CI request form](/services/ibm-z/request_ci).
