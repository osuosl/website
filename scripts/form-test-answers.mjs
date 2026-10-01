// Answers scripts/test-forms.mjs gives the request forms, so the tickets read
// like a real request. They describe a made-up project, Kestrel, on the
// reserved kestrel.example domain.
//
// ANSWERS maps a field name to its answer: text for text fields, an option's
// value for selects, and "" to leave an optional field blank. A field missing
// here gets a generic "Sample ..." answer, and the script lists it so it can be
// added. CHECKED lists the checkboxes to choose whenever they're shown, on top
// of the ones a scenario chooses.

const SSH_KEY = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGm3vQe7Lk2xR9pTn4sWc8dHf1yJ0uBzK6aE5oVqX2Nr dana@kestrel.example";
const DEPLOY_KEY =
  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK8wT3nYp5cR2hLm7vQx0aZs4dJf9bUe1gNk6oWyH3Ci release@ci.kestrel.example";

// The questions every collaboration tool asks, under collaboration_tools_<tool>_.
function tool(name, answers) {
  return Object.fromEntries(
    Object.entries(answers).map(([key, value]) => [`collaboration_tools_${name}_${key}`, value]),
  );
}
const MOVING = {
  current_host: "A VM at Hetzner that one of our maintainers pays for",
  data_size: "About 15 GB, mostly uploads",
};

export const ANSWERS = {
  // Contact and project
  name: "Dana Whitfield",
  email: "dana@kestrel.example",
  project_name: "Kestrel",
  requester_role: "Maintainer and infrastructure lead",
  project_url: "https://kestrel.example/",
  source_code_url: "https://github.com/kestrel-build/kestrel",
  project_description:
    "Kestrel is a build cache and artifact server for C and C++ projects. Build systems such as CMake and Meson " +
    "use it to share compiled objects between developers and CI jobs, which cuts clean build times by 60 to 80 " +
    "percent. It's used by several Linux distributions and a few hundred companies.",
  software_license: "Apache-2.0",
  est_size_of_user_community: "About 4,000 users and 35 active contributors",
  fiscal_sponsor: "Software Freedom Conservancy",
  current_hosting:
    "Our website and downloads run on a VM at Hetzner that one of our maintainers pays for personally, and our CI " +
    "uses GitHub's free runners. We've outgrown both: the VM is nearly out of disk, and CI jobs for our Arm and " +
    "POWER builds run under QEMU and take over an hour.",

  // Virtual machines
  instance_management: "Managed by the OSL",
  instance_platform: "OpenStack",
  instance_vcpus: "4",
  instance_memory: "8 GB",
  instance_disk: "80 GB",
  additional_volume: "500 GB",
  additional_volume_type: "HDD",
  number_of_nodes: "2",
  distribution: "Debian",
  openstack_access: "Have the OSL create the VM(s) for me",
  ssh_public_key: SSH_KEY,

  // CI/CD
  ci_cd_resource: "Our shared CI runners",
  ci_cd_server_management: "Managed by the OSL",
  ci_cd_system_other: "Buildbot",
  ci_cd_workload:
    "About 40 pipelines a day, each building and testing on three architectures. A full pipeline takes 25 " +
    "minutes on x86_64 but over an hour on emulated aarch64 and ppc64le, which is why we need native runners.",
  ci_cd_requirements: "Our integration tests start a small Docker Compose stack, so Docker-in-Docker is enough.",

  // FTP mirroring
  mirror_content_details: "Signed checksum files and our GPG release keys",
  mirror_size: "120 GB",
  mirror_growth:
    "Around 30 GB a year. We keep every release, and we plan to add nightly builds for two more architectures " +
    "next year, which could double that.",
  mirror_sync_method: "We pull from your server",
  mirror_sync_other: "Our release job uploads to an S3 bucket; rclone from there after each release would work.",
  mirror_source: "rsync://downloads.kestrel.example/kestrel/",
  mirror_sync_frequency: "Every 4 hours",
  mirror_sync_frequency_other: "30 */6 * * *",
  mirror_push_ssh_key: DEPLOY_KEY,
  mirror_bandwidth: "About 3 TB a month",

  // Email
  mail_relay_domain: "kestrel.example",
  mail_relay_current_setup: "Forwarding through our registrar, which is shutting the service down",
  mail_relay_dns_access: "Yes, we can update our DNS records",
  mail_relay_server: "mail.kestrel.example",
  mail_relay_rejects_unknown: "Yes",
  mail_relay_forwards_list:
    "security@kestrel.example -> dana@kestrel.example\ninfo@kestrel.example -> board@kestrel.example",
  mail_relay_external_servers: "203.0.113.25 and 2001:db8:4b::25, our build server, which sends release notifications",
  mail_relay_mailbox_details:
    "One shared mailbox for security@, so the security team can read and answer reports from one place.",

  // Mailing lists
  mailing_lists_count: "3",
  mailing_lists_subscribers: "About 1,200 in total; kestrel-announce has 900 of them",
  mailing_lists_domain_choice: "Our own domain(s)",
  mailing_lists_email_domain: "lists.kestrel.example",
  mailing_lists_web_host: "lists.kestrel.example",
  mailing_lists_dns_access: "Yes, we can update our DNS records",
  mailing_lists_current_host: "A Mailman server run by a former maintainer's employer",
  mailing_lists_current_software: "Mailman 2.1.39",
  mailing_lists_archives: "Yes, copy all of the archives",
  mailing_lists_archive_lists: "kestrel-devel and kestrel-users",
  mailing_lists_archive_size: "About 900 MB covering 11 years",

  // Website
  website_type: "Static site",
  website_type_other: "A Go binary that serves our documentation search",
  website_php_app: "WordPress",
  website_container_deploy: "From a container image you publish to a registry",
  website_container_image: "ghcr.io/kestrel-build/website:main",
  website_container_repo: "https://github.com/kestrel-build/website, main branch",
  website_container_app: "Redmine 6 with the redmine_agile plugin",
  website_container_notes:
    "The app needs a GitHub API token to show release notes, and uploaded images must be kept between deploys.",
  website_updates: "We will update it ourselves",
  website_disk: "5 GB",
  website_domains: "kestrel.example, www.kestrel.example and docs.kestrel.example",
  website_ssh_access: "Yes",
  website_ssh_key: SSH_KEY,
  website_bandwidth: "About 2,000 visitors a day",

  // Collaboration tools
  ...tool("gitlab", {
    domain: "git.kestrel.example",
    users: "About 60 regular users",
    sign_in: "With GitHub sign-in",
    migration: "New instance",
    expected_usage: "About 20 GB of repositories and CI artifacts in the first year, growing by 10 GB a year.",
    storage: "50 GB",
    pages_domain: "pages.kestrel.example",
    ...MOVING,
    current_version: "17.4",
  }),
  ...tool("discourse", {
    domain: "forum.kestrel.example",
    users: "About 500 registered users, 50 active each week",
    sign_in: "With GitHub sign-in",
    migration: "Moving an existing instance",
    expected_usage: "About 3 GB of posts and uploads, growing by 1 GB a year.",
    ...MOVING,
    current_version: "3.3",
  }),
  ...tool("matrix", {
    domain: "matrix.kestrel.example",
    users: "About 150 users",
    migration: "New instance",
    expected_usage: "A few busy rooms; about 5 GB of media in the first year.",
    ...MOVING,
    current_version: "Synapse 1.110",
    server_name: "kestrel.example",
    delegation: "Yes",
    registration: "Registration with a token you hand out",
    registration_system: "Our Keycloak server at sso.kestrel.example",
    federation: "Yes, federate with other Matrix servers",
    element: "Yes",
    element_domain: "element.kestrel.example",
    irc_networks: "Libera.Chat",
    webhook_sources: "GitHub",
  }),
  ...tool("mattermost", {
    domain: "chat.kestrel.example",
    users: "About 80 users",
    sign_in: "With GitLab sign-in",
    migration: "New instance",
    expected_usage: "About 10 GB of files in the first year.",
    ...MOVING,
    current_version: "9.11",
    license: "No, the open source edition is fine",
  }),
  ...tool("nextcloud", {
    domain: "cloud.kestrel.example",
    users: "About 25 users, mostly the steering committee and event volunteers",
    sign_in: "Local accounts",
    migration: "New instance",
    expected_usage: "Shared documents and conference photos, about 100 GB in the first year.",
    ...MOVING,
    current_version: "29",
    storage: "200 GB",
    other_apps: "Tasks",
    max_file_size: "4 GB, for conference recordings",
    mail_domain: "kestrel.example",
    office: "No",
  }),
  ...tool("hedgedoc", {
    domain: "notes.kestrel.example",
    users: "About 40 users",
    sign_in: "With GitHub sign-in",
    migration: "New instance",
    expected_usage: "Meeting notes, a few hundred MB a year.",
    ...MOVING,
    current_version: "1.9",
    guest_access: "No",
    email_registration: "No, only through the sign-in methods above",
    default_permission: "Signed-in people can edit, and anyone can read",
    landing_page: "No, the default is fine",
  }),
  collaboration_tools_other: "Zulip (https://zulip.com/) for our contributor chat",
  collaboration_tools_unlisted_storage: "20 GB",
  ...tool("unlisted", {
    domain: "zulip.kestrel.example",
    users: "About 200 users",
    sign_in: "With GitHub sign-in",
    migration: "Moving an existing instance",
    expected_usage: "About 5 GB of messages and uploads, growing slowly.",
    ...MOVING,
    current_version: "Zulip 9.2",
  }),

  // Databases
  database_mysql_databases: "One 2 GB database for our website",
  database_mysql_names: "",
  database_mysql_other: "",
  database_postgresql_databases: "One 10 GB database for GitLab and one 1 GB database for Matrix",
  database_postgresql_names: "kestrel-gitlab and kestrel-matrix",
  database_postgresql_other: "The pg_trgm extension for GitLab",

  // Object storage
  object_storage_size: "300 GB, growing by 50 GB a year",
  object_storage_use: "Release files and nightly build artifacts",
  object_storage_buckets: "kestrel-releases\nkestrel-nightly",
  object_storage_access: "Some buckets public, some private",
  object_storage_public_buckets: "kestrel-releases",
  object_storage_domain: "s3.osuosl.org is fine",
  object_storage_custom_domain: "downloads.kestrel.example",
  object_storage_other: "Delete objects in kestrel-nightly after 30 days.",

  // DNS
  dns_type: "Primary, where the OSL hosts and updates your zones",
  dns_domains: "kestrel.example and kestrel-build.example",
  dns_current_provider: "Our registrar's free DNS",
  dns_primary_server: "ns1.kestrel.example",
  dns_registrar_access: "Yes",

  // Co-location
  colocation_management: "Unmanaged, we will manage it ourselves",
  colocation_servers: "2",
  colocation_rack_units: "3",
  colocation_network_ports: "6",
  colocation_ipv4: "4",
  colocation_lag: "No",
  colocation_hardware:
    "A Dell PowerEdge R660 (1U, about 450 W) with two 10G SFP+ ports and a BMC port, and a Supermicro " +
    "SYS-620P (2U, about 600 W) with two 1G copper ports and a BMC port.",

  // Other details
  possible_contributions_to_cover_costs: "We can contribute $2,000 a year from our Conservancy funds.",
  deadline: "Our Hetzner VM's contract ends on March 31, 2027.",
  other_pertinent_information_about_project:
    "Most of our maintainers are in Europe, so email is the best way to reach us.",

  // POWER, AArch64 and IBM Z forms
  description_of_project_mission:
    "Kestrel aims to make large C and C++ builds fast on every platform those projects ship on. Several of our " +
    "users build for POWER, and we need to test cache compatibility on ppc64le natively.",
  expected_usage_model:
    "Running our release builds and test suite on each pull request, and troubleshooting architecture-specific bugs.",
  anticipated_duration_of_need: "Ongoing",
  ibm_advocate: "We don't have one yet",
  deployment_timeframe: "Within 7 business days",
  power_architecture: "POWER10",
  other_information: "We'd like to start with one VM and add a second if our CI load grows.",
  platform_other_details: "AlmaLinux 9",
  gpu_access: "No",
  "ci-github": "dwhitfield, kestrel-bot",
};

export const CHECKED = [
  "ci_cd_arch_x86_64",
  "ci_cd_arch_aarch64",
  "ci_cd_arch_ppc64le",
  "ci_cd_system_gitlab_ci",
  "mirror_content_releases",
  "mirror_content_packages",
  "mail_relay_inbound",
  "mail_relay_forwards",
  "mailing_lists_new",
  "collaboration_tools_gitlab_registry",
  "collaboration_tools_gitlab_object_storage",
  "collaboration_tools_matrix_moderation",
  "collaboration_tools_nextcloud_app_calendar",
  "collaboration_tools_nextcloud_app_deck",
  "collaboration_tools_nextcloud_app_groupfolders",
  "colocation_dual_power",
  "colocation_rails",
  "colocation_bmc",
  "colocation_network_1g_copper",
  "colocation_network_10g_sfp",
  "platform_debian",
  "platform_ubuntu",
];
