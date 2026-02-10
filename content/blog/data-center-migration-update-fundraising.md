---
title: "Data Center Migration Update and Fundraising Campaign"
date: 2026-02-10T10:00:00-08:00
type: blog
authors: ["Lance Albertson"]
---

In [December, I announced]({{< ref "/blog/osl-moving-to-state-data-center" >}}) that the OSL would be relocating from
our longtime home in Kerr B210 to Oregon's State Data Center in Salem. I'm excited to share that we've made tremendous
progress on this historic migration, and I'm pleased to announce a critical fundraising campaign to support this
endeavor.

## Migration Progress: Halfway There

{{< figure src="/images/sdc-cart.webp"
  alt="Cart loaded with servers, ready to be installed in new racks"
  caption="Cart loaded with servers, ready to be installed in new racks"
  class="blog-right" >}}

Since we began the physical migration in early December, **we've successfully relocated 128 servers out of
approximately 260 total systems**, putting us just past the halfway mark. We're currently making three trips per week
to Salem, moving approximately 10 servers per trip. Our timeline remains on track for completion by the end of March,
though we're optimistic about finishing sooner.

The first major milestone is nearly complete: we've almost finished moving all OSL internal infrastructure. This
includes:

- **OpenStack clusters** across all three architectures (x86_64, ARM64, and POWER)
- **Ganeti hypervisors** and associated infrastructure
- **Database systems** including MySQL and PostgreSQL clusters
- **CI runners** and other supporting development infrastructure

This February marks an exciting new phase: **we're beginning to migrate project co-located systems**. The following 26
projects all have physical hardware hosted at the OSL that needs to be carefully relocated to Salem:

{{< raw >}}
<div class="project-list">
<ul>
<li><a href="https://www.adelielinux.org/">Adelie Linux</a></li>
<li><a href="https://almalinux.org/">AlmaLinux</a></li>
<li><a href="https://www.alpinelinux.org/">Alpine Linux</a></li>
<li><a href="https://aomedia.org/">Alliance for Open Media</a></li>
<li><a href="https://www.buildbot.net/">Buildbot</a></li>
<li><a href="https://www.debian.org/">Debian</a></li>
<li><a href="https://www.drupal.org/">Drupal</a></li>
<li><a href="https://www.enlightenment.org/">Enlightenment</a></li>
<li><a href="https://f-droid.org/">F-Droid</a></li>
<li><a href="https://fedoraproject.org/">Fedora</a></li>
<li><a href="https://www.freebsd.org/">FreeBSD</a></li>
<li><a href="https://www.freedesktop.org/">Freedesktop</a></li>
<li><a href="https://gcc.gnu.org/wiki/CompileFarm">GCC Compile Farm</a></li>
<li><a href="https://www.gentoo.org/">Gentoo Linux</a></li>
<li><a href="https://www.gnome.org/">GNOME</a></li>
<li><a href="https://kodi.tv/">Kodi</a></li>
<li><a href="https://www.openstreetmap.org/">OpenStreetMap</a></li>
<li><a href="https://openwrt.org/">OpenWRT</a></li>
<li><a href="https://www.osgeo.org/">OSGEO</a></li>
<li><a href="https://parisc.wiki.kernel.org/">PARISC Linux</a></li>
<li><a href="https://personaltelco.net/">PersonalTelco</a></li>
<li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
<li><a href="https://rockylinux.org/">Rocky Linux</a></li>
<li><a href="https://www.rtems.org/">RTEMS</a></li>
<li><a href="https://sourceware.org/">Sourceware</a></li>
<li><a href="https://xiph.org/">Xiph</a></li>
</ul>
</div>
{{< /raw >}}

Each project requires coordination to schedule downtime, physically transport the hardware, and verify services are
fully operational in the new facility.

### Network Gateway Migration and IPv6

Also this month, we'll reach another critical milestone: **migrating our network gateways to Salem**. Historically,
LinkOregon has managed our network gateways since we lacked the network gear to handle this ourselves. With our
upgraded 100G core infrastructure, we can now take direct control of our network routing, giving us far more
flexibility in how our network is configured and managed.

This gateway migration also gives us the opportunity to **finally complete our IPv6 rollout across all networks**.
We've had long-standing requests to enable IPv6 on our OpenStack clusters, which requires SLAAC (Stateless Address
Autoconfiguration). We had initially disabled SLAAC to keep things simple and hadn't had the opportunity to coordinate
the switchover with LinkOregon. This migration provided the perfect opportunity to make the cutover and deliver full
IPv6 support to every project we host.

## Support This Critical Transition

{{< figure src="/images/corvallis-racks-empty.webp"
  alt="Partially emptied racks in the Corvallis data center"
  caption="Partially emptied racks in the Corvallis data center"
  class="blog-right" >}}

This isn't just a move, it's an upgrade. We've reached the limit of what our Corvallis facility can power, and this
migration to a state-of-the-art facility ensures the long-term stability of the global projects we host. It also gives
OSU students the rare opportunity to lead a professional data center migration: an experience that makes them some of
the most sought-after graduates in the tech industry.

This is a massive undertaking, and we've launched a **new fundraising campaign through the OSU Foundation specifically
to help cover the extra costs of this migration** and replenish the reserves we've drawn down during the transition.

{{< raw >}}
<a href="https://www.beavsgive.org/organizations/open-source-lab"
  class="link-button">Donate to support the OSL migration →</a>
{{< /raw >}}

Your donation directly supports:

- Upgrading our core network from 10G to 100G, with top-of-rack switches now connected via 2x40G uplinks, a major
  performance improvement across the board
- Remote management tools for enhanced reliability, including a new out-of-band gateway with cellular connectivity,
  essential now that our hardware is a 45-minute drive away
- Shorter power cables, cable management ties, and other tools for cleaner rack organization
- Hardware upgrades including high-speed SSD/NVMe storage for our OpenStack clusters
- Student training and professional development opportunities

## What's Next

I'll continue sharing regular updates as we work through the co-located project migrations and network cutover. For
visibility into planned outages and the current status of OSL services, please visit
[status.osuosl.org](https://status.osuosl.org).

Thank you to everyone who has supported the OSL throughout this journey. Your contributions, whether through donations,
project partnerships, or simply spreading the word, make it possible for us to continue empowering open source
communities worldwide.
