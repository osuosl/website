---
title: "Hosting Details"
toc: true
---

We offer a wide variety of services to our hosted projects so the OSL can take work off your own machines and
infrastructure team. This list is not exhaustive, but it should give you a good idea of the types of services we
provide. Our [Hosting Policy](/services/hosting/policy) explains which projects we can host, and you can apply using our
[hosting request form](/services/hosting/request).

## Managed vs. Unmanaged

Most of our hosting falls into two categories: managed or unmanaged.

### Managed

For managed hosting, we take care of your systems using our configuration management, which keeps them up to date,
stable and automated with tested configurations. We use [Cinc](https://cinc.sh/), a free distribution of
[Chef](https://www.chef.io/), to manage all of our systems, and we can create a project-specific cookbook if you want to
help manage your system. We also configure and maintain the services running on your systems, including monitoring them
and backing up their data.

Managed systems are ideal for smaller projects that have simple requirements and don't want to deal with day-to-day
system administration. We currently manage systems for phpBB, the OpenPOWER Foundation, ROS and the Open Source Robotics
Foundation (OSRF), U-Boot, Nura (formerly postmarketOS) and many more.

### Unmanaged

Unmanaged hosting means you control everything about your systems. We only require that you keep one sudo-enabled
account on each system for us to use for troubleshooting. We will not actively manage, monitor or back up these systems
unless you ask us to. If you run into an issue with an unmanaged system, we're still available to help.

## Virtualization

![Hosting Detail - Sysadmin](/images/student-sysadmin.jpg#right)

We have two virtualization platforms available: [Ganeti](https://ganeti.org/) and
[OpenStack](https://www.openstack.org/). Depending on a project's needs, we host its VMs on either or both platforms.
Both use the [KVM hypervisor](https://linux-kvm.org/).

### OpenStack

OpenStack offers a full API and web interface that let projects manage their VMs as they see fit. Our OpenStack clusters
currently offer the following services:

- Identity (keystone)
- Compute (nova)
- Block Storage (cinder)
- Image (glance)
- Network (neutron)
- Orchestration (heat)
- Dashboard (horizon)

We add more OpenStack services as projects need them. We run three OpenStack clusters: an x86_64 cluster with 10 compute
nodes, a ppc64le (POWER) cluster with 15 compute nodes and an aarch64 (Arm) cluster with 10 compute nodes. The ppc64le
and aarch64 clusters also host our [POWER Development](/services/powerdev) and [AArch64 Development](/services/aarch64)
programs. If you need to create, destroy and manage your own VMs on demand, OpenStack is the best choice.

Storage is provided by Ceph. A 17-node Ceph cluster with roughly 600 TB of raw capacity serves the x86_64 and aarch64
clusters, and a five-node cluster with roughly 300 TB serves the ppc64le cluster. Ceph keeps three copies of all data,
which leaves over 200 TB of usable storage for OpenStack. SSD-backed volumes are also available on request for workloads
that need faster disks.

Some compute nodes in the x86_64 and ppc64le clusters use local NVMe storage instead of Ceph for workloads that need
even faster disk I/O. We plan to add an NVMe node to the aarch64 cluster soon.

### Ganeti

We have used Ganeti since 2009, and it remains a stable choice for long-running VMs that rarely change. Our four-node
cluster for hosted projects offers VMs in a variety of sizes and operating systems, all with fully redundant storage
using DRBD. Ganeti is simple to use and maintain, but it doesn't provide a public API or web interface for managing VMs,
so any changes to your VM go through our team.

## CI/CD Hardware Resources

Many FOSS projects need more continuous integration and continuous delivery (CI/CD) capacity than they can get for free.
Hosted services such as GitHub Actions have free tiers, but many projects run into their limits. We can help in three
ways:

- Virtual machines on our OpenStack clusters
- Our shared CI runners
- Dedicated bare metal servers

We have a limited supply of Inspur NE5260M5 servers for this. Each server has two Intel Xeon Platinum 8280 CPUs at
2.70GHz (56 cores and 112 threads in total) and 768 GB of RAM. For storage, each server has either two NVMe slots (you
provide the NVMe drives) or six SATA slots without hardware RAID. These servers are in our Salem data center and have
public IP addresses.

They run our shared [GitLab](https://about.gitlab.com/) runners and also serve as compute nodes in our x86_64 OpenStack
cluster. We plan to offer shared runners for [GitHub Actions](https://github.com/features/actions),
[Forgejo](https://forgejo.org/) and [Jenkins](https://www.jenkins.io/) in the future. Projects with a demonstrated need
can also request a dedicated server and use it however they like, whether with one of the CI/CD systems above or any
other. [Sourceware](https://sourceware.org/) and [OpenWrt](https://openwrt.org/) are among the projects already using
these servers.

## FTP Mirroring

Instead of distributing files and releases from your own servers, you can let our mirror network handle it. Three
servers sit behind [ftp.osuosl.org](https://ftp.osuosl.org/) with a combined bandwidth capacity of 60 gigabits per
second. They are located in Salem, Chicago and New York, and each one carries a full copy of the content.

Because space on the main mirrors is limited, we also host projects on [ftp2.osuosl.org](https://ftp2.osuosl.org/). It
runs in Salem and stores its content on our Ceph cluster instead of copying it to every server.

We currently host about 100 projects using around 37 TB of disk space, about 16 TB on the main mirrors and 21 TB on
ftp2. We do our best to host as many projects as we can. We plan to upgrade the mirror hardware in 2027, which will add
much more disk capacity and room for more projects. We hope to move the ftp2 projects back to the main mirrors as part
of that upgrade.

## Email

### Mail Relaying

We run four mail relays that handle inbound and outbound mail for many of the projects we host, including their mailing
lists and email forwards. OSL-hosted servers can send mail through these relays instead of running their own mail
server. The relays provide:

- Spam and virus filtering with SpamAssassin, ClamAV, Spamhaus blocklists and greylisting
- DKIM signing of outbound mail for your project's domain
- SPF, DKIM and DMARC checks on inbound mail, with ARC headers that preserve those results when mail is forwarded
- Sender Rewriting Scheme (SRS) for forwarded mail, so it continues to pass SPF checks at its destination
- A 30-day quarantine for blocked mail, so we can release messages that were caught by mistake

### Mailing Lists

We use [Mailman](https://www.list.org/) for mailing lists. Lists are managed centrally on our servers, so you don't need
to maintain the software, mail delivery or spam filtering yourself. We can create new lists for your project or migrate
your existing lists, including their archives. Our list hosting includes:

- Lists on your project's own domain (e.g., `lists.example.org`) or on `lists.osuosl.org`
- Web-based list administration and moderation, with public or private archives
- CAPTCHA protection on subscription forms to keep out bot sign-ups
- DMARC handling, so posts from senders with strict DMARC policies still reach subscribers
- Delivery through our [mail relays](#mail-relaying), with spam and virus filtering on incoming posts

We currently run Mailman 2 and plan to offer [Mailman 3](https://docs.mailman3.org/) soon. Mailman 3 adds a modern web
interface, searchable archives with a forum-style view and a single account for managing all of your subscriptions. Once
it's available, we can help move existing lists over.

## Website Hosting

We host websites of all kinds, from static sites built with generators like [Hugo](https://gohugo.io/) to dynamic web
applications written in PHP, Python or Ruby. Well-known platforms we host include Drupal, WordPress, phpBB, MediaWiki
and Trac, along with containerized applications running under Docker. Our web hosting includes:

- Free HTTPS certificates from [Let's Encrypt](https://letsencrypt.org/) that renew automatically
- A redundant pair of load balancers in front of your site
- Protection from aggressive AI crawlers and scrapers using [Anubis](https://anubis.techaro.lol/), which we can put in
  front of sites that need it
- [Database hosting](#database-hosting), [monitoring](#monitoring) and [backups](#backups)

Sites can run on our shared web servers or on a dedicated VM, depending on how much control and how many resources your
project needs. We can't support every web application, but we'll do our best to support any widely used platform. If you
have a website that needs a home, let us know and we'll see how we can help.

## Collaboration Tools

We also run the collaboration tools that many open source communities depend on. These are managed services, so we
handle the installation, upgrades, monitoring and backups. We currently host:

- [GitLab](https://about.gitlab.com/) instances for projects such as Deluge, U-Boot and Nura, and we plan to offer
  [Forgejo](https://forgejo.org/) soon
- [Discourse](https://www.discourse.org/) forums
- [Matrix](https://matrix.org/) and [Mattermost](https://mattermost.com/) chat servers
- [Nextcloud](https://nextcloud.com/) for file sharing, along with [HedgeDoc](https://hedgedoc.org/) for collaborative
  editing

For example, we run the complete services stack for the [OpenPOWER Foundation](https://openpowerfoundation.org/),
including its forum, file sharing, collaborative documents and single sign-on. If your community uses a different open
source tool, let us know and we'll see if we can host it.

## Database Hosting

We offer hosted [MySQL](https://www.mysql.com/) and [PostgreSQL](https://www.postgresql.org/) databases on shared,
highly available database clusters, so your project doesn't need to run its own database server:

- MySQL runs on [Percona Server](https://docs.percona.com/percona-server/8.0/) 8.0 across four
  servers, set up as two replicated pairs so either server in a pair can take over if the other fails
- PostgreSQL 16 runs on a three-node cluster with streaming replication, using [pgpool-II](https://www.pgpool.net/) for
  connection pooling and automatic failover

We plan to upgrade MySQL to 8.4 LTS and PostgreSQL to 17 soon, followed by PostgreSQL 18.

We handle upgrades, tuning, monitoring and backups. The databases are available to any OSL-hosted system, whether it's a
VM, a web application or a co-located server. We recommend that projects use these clusters instead of running their own
database server on a VM, since the clusters are redundant and we maintain them for you.

## Object Storage

We offer S3-compatible object storage at `s3.osuosl.org`, which runs on the Ceph RADOS Gateway in our x86_64 Ceph
cluster. It works with standard S3 clients and SDKs and is a good fit for build artifacts, release files, package
repositories and other data that doesn't need to live on a VM. For example, [OpenVox](https://voxpupuli.org/openvox/)
serves its package repositories from our S3 service. Buckets can also be published as static websites through
`s3-website.osuosl.org`.

## DNS Hosting

We provide authoritative DNS for projects on our name servers (`ns1.auth.osuosl.org`, `ns2.auth.osuosl.org` and
`ns3.auth.osuosl.org`). We can host your project's zones and update records for you as your OSL-hosted services change.
We don't offer a self-service way to update DNS yet, so changes to zones we host go through our team. If you'd rather
manage your zones yourself, we also offer secondary DNS, where our name servers transfer copies of your zones from your
own primary name server. We plan to add DNSSEC support in the future.

## Co-Location Hosting

For projects that need more than a virtual machine or website, we offer co-location hosting. We currently host hardware
for 26 projects, including [Debian](https://www.debian.org/), [Fedora](https://fedoraproject.org/),
[FreeBSD](https://www.freebsd.org/), [PostgreSQL](https://www.postgresql.org/) and [Gentoo](https://www.gentoo.org/).

Our racks are in [Oregon's State Data Center]({{< ref "/blog/osl-moving-to-state-data-center" >}}) in Salem, a Tier 3
equivalent facility with N+1 redundant power and cooling, backup generators and 24/7 guarded access. Co-located servers
connect to our 100 Gbps core network and can use our [database](#database-hosting), [mail](#mail-relaying) and
[monitoring](#monitoring) services like any other OSL-hosted system. Access to the facility is restricted, so projects
ship their hardware to us and our staff handle the installation and any hands-on work.

Space and power are limited, and each rack has a recurring colocation cost, so we only take on new hardware when a
project has a clear need for it. Because of this, new co-located projects are required to help cover the cost of
hosting their hardware. Projects we already host are not required to, but we encourage them to [contribute](/donate). We
generally prefer that projects virtualize as much of their infrastructure as possible, and our [OpenStack](#openstack)
and [Ganeti](#ganeti) clusters are often a better fit.

We require all servers to have sliding rails. Hardware must be purchased from a vendor rather than built by hand, to
make sure it operates as intended. We also prefer hardware with redundant power supplies, some type of out-of-band
management (e.g., IPMI, iLO or iDRAC) and a three-year basic hardware warranty. We'd rather not host machines larger
than 2U, but we can work with you to accommodate larger servers if needed.

## Monitoring

### Alerting

We use [Prometheus](https://prometheus.io/) and [Nagios](https://www.nagios.org/) to monitor our managed hosts and the
services running on them, including web servers, databases, mail and load balancers. When something goes wrong, alerts
go to our on-call staff through [PagerDuty](https://www.pagerduty.com/). We are gradually moving our alerting from
Nagios to Prometheus. We can also set up custom monitoring and notifications for hosted projects as needed.

### Metrics and Dashboards

Prometheus collects metrics such as CPU usage, load, memory, disk, network traffic and service-specific statistics from
every managed host. We use [Grafana](https://grafana.com/) to graph them and track trends over time, which helps us plan
capacity and troubleshoot problems with your systems.

### Status Page

We post planned maintenance and outages on our [status page](https://status.osuosl.org/), where you can subscribe to
updates.

## Backups

We back up managed hosts and the databases on our [database clusters](#database-hosting) at least once a day:

- Files are backed up with [rdiff-backup](https://rdiff-backup.net/), which keeps incremental snapshots
- MySQL databases are dumped with [mydumper](https://github.com/mydumper/mydumper), and PostgreSQL databases with
  `pg_dump`

Our monitoring alerts us if a backup fails. Backups are meant for short-term disaster recovery, not long-term data
recovery. We keep them long enough to rebuild a server or restore a database after a failure, but not to recover files
from long ago. If your project needs longer retention or an archive of its data, let us know. We
also recommend keeping your own copies of anything critical.
