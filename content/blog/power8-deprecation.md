---
title: "Retiring POWER8 from OpenPOWER Cluster"
date: 2026-07-22
authors: ["Lance Albertson"]
---

We have deprecated the POWER8 systems in our OpenPOWER OpenStack cluster and are decommissioning the hardware over the
next few weeks. All instances that were running on POWER8 have been migrated to POWER9, and POWER9 and POWER10 remain
available for new [hosting requests](/services/powerdev/request-hosting).

## Why now

POWER8 has been heading toward retirement for some time. IBM reached end of service for the POWER8 line in 2024, and
while hardware support remained in place, IBM no longer provides firmware or security updates for these systems. The
wider Linux ecosystem has moved on as well: RHEL 9 and its rebuilds such as AlmaLinux require POWER9, Ubuntu did the
same starting with 22.04, and Debian is discussing raising its ppc64el baseline to POWER9 for its next release. We have
standardized on AlmaLinux for our OpenStack platform, and since AlmaLinux 9 requires POWER9, the POWER8 nodes had
stayed on AlmaLinux 8 and out of step with the rest of the platform.

Recent power constraints in our data center made this the right time to act: retiring the POWER8 hardware, which was
already planned, was a straightforward way to reduce load where it matters most.

This is a familiar cycle for the lab. We have provided the open source community access to every POWER generation from
POWER5 through POWER8 over the years, and each of those earlier generations was eventually decommissioned for similar
reasons.

## What this means for projects

Instances were migrated live to POWER9, so no action is required on your part. Two requests:

- If you find you have lost access to your instance since the migration, email
  [powerdev-request@osuosl.org](mailto:powerdev-request@osuosl.org) and we will resolve it.
- If you no longer need your VM on the cluster, please let us know so we can free up those resources for other
  projects.

This retirement covers the OpenPOWER cluster only. Projects using co-located POWER8 systems are not affected: that
hardware remains in place for now and is not yet planned for decommissioning, though we expect that to happen within
the next year or two. We are also looking at decommissioning the POWER8 systems used by our hosted CI runners in the
near future.

## POWER11 on the horizon

We also have a POWER11 system and are currently working on integrating it into the OpenPOWER cluster. There is no exact
ETA yet, but we expect it to be available in a month or two — watch this blog for an announcement.

Thank you to all the projects that put POWER8 to good use over the years, and please reach out with any questions or
concerns.
