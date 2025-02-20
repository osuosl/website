---
title: "OpenStack on OpenPOWER"
date: 2014-04-23
authors: ["ramereth"]
slug: openstack-on-openpower
tags: []
---

![OpenStack on OpenPOWER](/images/openstack-power.png#blog)

[Openstack](http://openstack.org/) has been growing in popularity over the past few years and recently we’ve started to
look into it further here at the OSL. We plan to continue to use [Ganeti](https://code.google.com/p/ganeti/) for our
high-available IaaS needs, however we’re researching ways to integrate Openstack at the lab as well. While Ganeti
provides a solid, stable and simple platform for general IaaS needs, Openstack provides better support for elastic and
dynamic needs. We feel that using both platforms gives the best of both worlds, because they each fill a specific niche
in a cloud environment.

Earlier this year we teamed up with [IBM](http://www-03.ibm.com/linux/ltc/) to work on deploying Openstack on the
[OpenPOWER architecture](http://openpowerfoundation.org/) with the goal of expanding our Supercell infrastructure beyond
the x86 architecture. Thanks to the hard work by both the IBM and OSUOSL team, we’ve been able to deploy Openstack on
four IBM OpenPOWER machines which support KVM and little endian.

![OpenStack running Fedora Guest](/images/ppc64-openstack.png#center)

OpenStack on OpenPOWER screenshot running a Fedora Guest.

Currently we have the nodes deployed on Fedora 20 with Fedora 20 guests working properly. We’re also working on getting
Debian and Ubuntu guests to work properly. Our goal is to provide ppc64 guest images for the Openstack Community on
OpenPOWER in addition to providing
[OpenPOWER Openstack and KVM specific deployment documentation](http://wiki.osuosl.org/openpower/index.html). We are
planning to provide this platform to the general FOSS communities by early June 2014.

To keep up to date on the status of the cluster, please feel free to subscribe to the
[OSUOSL OpenPOWER announcement mailing list](http://lists.osuosl.org/mailman/listinfo/openpower).
