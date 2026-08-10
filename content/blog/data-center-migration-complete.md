---
title: "Data Center Migration Complete: A New Chapter for the OSL"
date: 2026-08-11
authors: ["Lance Albertson"]
---

In [February, I shared]({{< ref "/blog/data-center-migration-update-fundraising" >}}) that we had crossed the halfway
point of our historic move from Kerr B210 to Oregon's State Data Center in Salem. I'm overdue in sharing the good news:
**we completed the migration in mid-March, ahead of our end-of-March target.** Every server and every co-located project
system, along with our entire network, now runs from our new home, and the months since have been some of the most
productive in the lab's history.

## Migration Complete: By the Numbers

{{< figure src="/images/sdc-racks.webp"
  alt="OSL's racks fully installed in Oregon's State Data Center"
  caption="OSL's racks in Oregon's State Data Center"
  class="blog-right" >}}

When we started in early December, the finish line looked distant. Fifteen weeks later:

- **Approximately 260 servers** were physically relocated to Salem, at a peak pace of roughly ten servers per trip,
  three trips a week
- **Hardware for all 26 co-located projects**, including Debian, Fedora, FreeBSD, PostgreSQL, and Gentoo, was moved and
  verified as fully operational in coordination with each community
- **Our network gateways moved under direct OSL control** for the first time, running on our upgraded 100G core
- **IPv6 is now available across our networks**, with long-requested automatic address configuration (SLAAC) enabled on
  our OpenStack clusters

None of this would have happened without the donors and sponsors who stepped up during our fundraising campaign. A
special thank-you also goes to OSU's University Information and Technology department for lending us one of their
engineers throughout the move; his help made this migration possible.

## Beyond the Migration

The move wasn't the only thing keeping us busy. Backed by the support of our sponsors and donors, we spent the spring
and summer modernizing the software that runs the lab:

- **A rebuilt automation pipeline.** We overhauled how we test and ship the [Cinc](https://cinc.sh) (Chef) configuration
  management code behind every OSL service: automated, label-driven releases with continuous integration across our
  entire GitHub organization, now covering 74 actively maintained cookbooks (configuration modules) that manage more
  than 200 of our systems.
- **High availability for OpenStack.** The move gave us the chance to shift hardware around, and our control plane now
  runs active-active, with no single point of failure and a new clustered messaging tier behind it, so hosted projects
  see fewer maintenance windows and faster recovery.
- **Platform refresh.** We're in the middle of upgrading our AlmaLinux systems from 8 to 9, with a move to AlmaLinux 10
  planned next, retiring years of outdated configurations along the way.
- **Protection from aggressive bot traffic.** We've strengthened the bot protection on our HAProxy frontend, which many
  hosted projects share, and brought additional sites behind [Anubis](https://anubis.techaro.lol), an open source tool
  that filters abusive scrapers, keeping project sites fast and available despite the industry-wide surge in bot
  traffic.
- **A modernized monitoring stack.** We upgraded Prometheus and reworked our Nagios automation, extending metrics
  coverage to newer pieces of our infrastructure like the OpenStack messaging tier.
- **Power tracking for the new facility.** We no longer have direct access to metrics from the power distribution units
  (PDUs) in our racks, so we built a pipeline that turns the facility's power reports into Grafana dashboards, letting
  us watch our energy footprint rack by rack.
- **Improved storage tooling.** We rebuilt the backend tooling for provisioning S3-compatible storage on our Ceph
  clusters, making it faster for us to set up object storage for projects that need it.
- **A new osuosl.org.** We rebuilt this website on OSU's Madrone design system, with the WCAG 2.1 AA accessibility
  standard enforced automatically on every build.

Just as importantly, new communities keep arriving. Since the move we've onboarded the **OpenPOWER Foundation**,
building and now operating their complete services stack, including their forum, file sharing, collaborative documents,
and single sign-on. And since our sponsors stepped up in July 2025, more than twenty new projects and services have
joined the lab:

- **Managed services**: a new [GitLab instance](https://git.u-boot-project.org) and
  [mailing lists](https://lists.u-boot-project.org) for the U-Boot project.
- **POWER development cluster**: [Amazon Corretto](https://aws.amazon.com/corretto/),
  [MongoDB](https://www.mongodb.com), [SciPy](https://scipy.org), [Zig](https://ziglang.org),
  [Cryptography](https://cryptography.io), [Firefox JIT](https://spidermonkey.dev) (work on Firefox's JavaScript engine
  for POWER10), the [Lynx](https://github.com/lynx-chess/Lynx) chess engine, RefPerSys, UNRES,
  [SIMD.info/SIMD.ai](https://simd.info), Linux kernel BPF memory-model work, and a wave of post-quantum cryptography
  projects: [Open Quantum Safe](https://openquantumsafe.org) (including its
  [liboqs](https://openquantumsafe.org/liboqs/) library) and the [PQ Code Package](https://github.com/pq-code-package).
- **ARM64 hosting**: [Nix](https://nixos.org), [Zig](https://ziglang.org), and [Oreon Linux](https://oreonproject.org).
  We also began mirroring releases for Oreon and Vertex Linux.
- **Virtual machines and web hosting**: pgFirstAid, [Artizyou](https://artizyou.com), and
  [OpenVox](https://openvoxproject.org) package hosting.
- **Academic research on POWER**: the University of Texas at Austin (ransomware-detection research) and the University
  of Texas at El Paso (memory-performance research).

Behind that growth is a lot of day-to-day work: since July 2025 our team has fielded just over 500 support requests,
including roughly 280 general support tickets, nearly 130 requests in our POWER developer cloud, 32 new hosting
requests, and 24 abuse reports, with the rest spread across our ARM64, CI, and other queues. We resolved more than 400
of them.

## Why We Need Additional Funding for the Coming Year

Sponsors and donors carried us through the migration. Here's where I see new support making the biggest difference:

- **Colocation and operations.** The State Data Center gives us enterprise-grade power, cooling, and security, and it
  comes with a recurring colocation cost the lab never had in Corvallis, on top of the staff and student costs we
  already carry. Additional funding solidifies that new baseline.
- **Student staffing and training.** Our students run the lab's services every day. Funding pays student systems
  engineers and supports the mentorship that turns them into sought-after professionals.
- **Hardware and storage refresh.** The move made it clear which equipment is at end of life. We need to replace aging
  servers and keep expanding our storage cluster, work that has only gotten harder as equipment costs have risen.
- **A new FTP/mirror cluster.** Our public mirror infrastructure is aging, and its capacity is very limited. We're
  hoping to have enough funding to replace the cluster within the next year, which would let us greatly expand what we
  can offer to the community.
- **An additional full-time engineer.** The lab's services and hosted projects have outgrown our current staff
  footprint. A new full-time engineer would let us keep pace with growth and the increasing number of requests we
  receive, provide backup coverage for our critical services, and deepen student mentorship.

{{< raw >}} <a href="/donate/"
  class="link-button">Donate to support the OSL →</a> {{< /raw >}}

If your organization is interested in supporting the OSL, please reach out to us at <info@osuosl.org>. We're glad to
talk through where your funding would have the most impact.

## What's Next

One clear lesson from this year: we did a lot of work you never heard about. We're fixing that. Starting this month,
we're committing to **a brief update post every month** and **a deeper infrastructure review every quarter**, covering
what we shipped, which projects joined, and where things are headed. The first deep-dive, covering everything summarized
above, lands next week.

Thank you for supporting the OSL through this move and into what comes next.
