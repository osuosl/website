---
title: "OSL Infrastructure Migration: A Move to Oregon's State Data Center"
date: 2025-12-23T00:15:50-08:00
type: blog
authors: ["Lance Albertson"]
---

Earlier this year, I shared our ["OSL Future" update]({{< ref "/blog/osl-future-update" >}}), outlining the roadmap to
build a more sustainable and resilient OSU Open Source Lab. A key part of that plan was finding a professional-grade
physical home for our core infrastructure to replace the facility we've called home for the last two decades.

Today, I am thrilled to announce a major milestone: **The OSL is officially moving to Oregon's State Data Center (SDC)
in Salem, Oregon.**

## The Legacy of the Kerr B210 Data Center

For over 20 years, the heartbeat of the OSL has been Kerr Administration Building, Room B210: a dedicated data center
that holds a legendary place in the history of the global open source community. Originally the home of the OSU
mainframe, Kerr B210 underwent a mission-critical renovation in 2005 and 2006; it was converted into a data center to
support the OSL's rapid growth and other OSU Department co-location needs.

In the years following, OSUOSL became the primary home for the Linux Foundation and hosted Kernel.org for an extended
period. The OSL also onboarded major projects including Gentoo Linux, Debian, and Drupal during this time, and
continues to host these and many other projects today. While not designed as a high-density facility, Kerr B210 served
as a critical hub for major open source projects. In recent years, both the Linux Foundation and Kernel.org have
graduated to cloud infrastructure, a testament to how successfully OSUOSL helped them to scale and grow. We remain
proud partners with the Linux Foundation, and continue supporting their mission to advance open source development.

While Kerr B210 served the Lab well for twenty years, the facility has reached the end of its intended lifecycle for
the OSL's needs. As the infrastructure aged, it became clear that continued investment in the facility would be
necessary, and OSU was unable to support further capital improvements. Additionally, no other locations on campus could
meet the OSL's space and power requirements. Moving to a dedicated, professional-grade facility like Oregon's State
Data Center is the logical next step in our evolution.

## Oregon’s State Data Center Facility

![OSL's racks in the Oregon's State Data Center](/images/sdc-racks.webp#right)

The Oregon State Data Center (SDC) in Salem provides the stability and infrastructure we need for the next 20 years.
Originally established in 2007 through the [Computing and Networking Infrastructure Consolidation
(CNIC)](https://digitalcollections.library.oregon.gov/nodes/view/208565) project, a $63.6 million legislative
investment to centralize fragmented IT infrastructure from 12 major state agencies, the facility was designed from the
ground up for high-availability enterprise operations.

The purpose-built, energy-efficient data center leverages Oregon’s temperate climate for "free cooling" (natural air
intake), a feature that has historically reduced energy consumption by approximately 35% compared to traditional
mechanical-only cooling facilities.

Between 2017 and 2021, the SDC underwent a significant [$17.8 million infrastructure modernization and lifecycle
refresh](https://www.oregonlegislature.gov/lfo/Documents/2019-21%20Budget%20Highlights.pdf). This project specifically
enhanced the facility's capacity for co-location services, introducing modern hot/cold aisle containment, upgraded
electrical switch gear, and enhanced backup power systems. The result is a "Tier 3" equivalent facility, meeting
industry standards for 99.98% uptime, providing enterprise-grade resiliency and security.

By moving to the SDC, the Open Source Lab gains access to:

- **Enterprise-Grade Resiliency:** The facility features N+1 power and cooling redundancy, backed by industrial-scale
  generators and a professional State IT Operations Team monitoring the environment 24/7.
- **A Scalable Footprint:** We are starting with 12 high-density racks in a 45U configuration, an upgrade from our
  previous 42U standard. The SDC offers the physical floor space and power density required for future growth as the
  OSL takes on new hardware partners and global projects.
- **Professional Governance:** The facility is managed by [Enterprise Information Services
  (EIS)](https://www.oregon.gov/eis/pages/default.aspx), the Office of the State Chief Information Officer. While the
  OSL retains full control and management of our own equipment and software stacks, EIS provides the world-class
  physical security (including 24/7 guarded access and biometric controls) and environmental infrastructure necessary
  for a modern data center.

## Moving Forward: Infrastructure and Network Strategy

This move also represents a significant infrastructure upgrade. Earlier in 2025, Intel generously donated 30
high-performance servers with a total value of approximately $50,000 to support OSUOSL infrastructure modernization.
Each system is equipped with:

- **768GB of RAM**
- **1TB NVMe storage**
- **6-bay 2.5" SATA configuration** providing flexibility for various storage and workload configurations

These servers will become the backbone for several critical workloads, including our GitLab CI/CD x86_64 runners,
OpenStack x86 hypervisors, and hosting for projects such as Sourceware, OpenWRT, OSGEO, and many others.

### Network Continuity: LinkOregon and VPWS

A migration of this scale, with hundreds of physical servers and petabytes of data to relocate, requires a
sophisticated networking approach. For this, OSUOSL is leaning on our long-standing partnership with
[LinkOregon](https://www.linkoregon.org), the state's non-profit research and education network. In fact, it was
critical that the Lab relocate to a facility where LinkOregon has a presence, as this allows us to maintain our
existing IP address space and ensure continuity for our hosted projects.

LinkOregon has worked closely with the OSL to establish a VPWS (Virtual Private Wire Service), essentially a
"pseudo-wire" between Kerr B210 and Oregon's State Data Center. This Layer 2 bridge provides several critical
advantages for our migration:

- **IP Continuity:** The pseudo-wire allows the servers in Salem to behave as if they are still in Corvallis. We can
  move physical hardware and plug it in at Oregon's State Data Center without having to change its IP address.
- **Phased Migration:** This allows us to migrate OSL systems gradually over several months, ensuring each service is
  verified before we proceed to the next.
- **The Final Cutover:** Once the migration is complete, we will migrate the routing IPs for all our subnets to OSL
  routers hosted directly in Oregon's State Data Center, finalizing the transition.

## Timeline and Next Steps

The work has already begun. Starting on December 3rd, I have made multiple trips to Salem to complete the initial
build-out of our first four racks, with the foundational setup completed by December 19th. Core networking gear and
power infrastructure are both ready for the next phase. On December 12th, I successfully connected our fiber link to
LinkOregon, and by December 17th, the VPWS pseudo-wire was fully operational, creating OSL’s critical network bridge
between Corvallis and Salem.

Projected timeline:

- **January:** With generous support from OSU UIT, I will continue moving internal OSL core management systems,
  including backend Ceph storage, OpenStack and Ganeti hypervisors, and other supporting infrastructure.
- **Q1/Early Q2:** Phased migration of projects with colocated equipment will begin. This move is expected to take
  approximately 2-3 months.

## Community Support

The transition from Kerr B210 to Oregon's State Data Center represents a pivotal moment in the OSL's history: a move to
a modern, professionally-managed facility that will support the global open source community for decades to come.

There will of course be significant costs associated with these benefits: Oregon's State Data Center charges a per-rack
fee for colocation services, and OSUOSL is investing in new equipment to ensure optimal performance in the new
location.

To help offset these costs and support the OSL's mission, we will be launching a fundraising drive in the coming weeks.
We welcome all continued and additional support from the community, donors, and partners who value the work OSUOSL does
to support the global open source ecosystem.

**As the OSUOSL embarks on this next chapter, we remain committed to empowering open source communities through
reliable, world-class infrastructure**. This move ensures the Lab’s ability to continue serving the projects and people
who depend on us, while positioning the OSL for sustainable growth well into the future. I will continue to share
updates and documentation throughout the migration process.

If you’ve gotten this far, thank you for being a part of this journey.

With gratitude,

Lance Albertson, Director

### A Note on Potential Delays

Due to the scope and complexity of this migration, response times to new requests may be delayed during this period.
Staff will do our best to manage any urgent issues that arise. For visibility into planned outages and the current
status of OSL services, please visit [status.osuosl.org](https://status.osuosl.org).
