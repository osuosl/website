---
title: POWER CI Request Form
slug: /powerdev/request_powerci
---

The Open Source Lab partners with IBM to host POWER based servers in order to provide an open platform for innovation to
the open source community. For more information about this partnership, please visit our
[POWER Development Hosting page](/services/powerdev).

Please use the form below to request new access to the POWER CI service provided by the OSUOSL.

For any changes, updates, or issues with an existing project please send the specific request as an email to
[powerci-request@osuosl.org](mailto:powerci-request@osuosl.org) and include the original project name in the subject
line and the names of the Jenkins jobs that have the issue in the message body.

This access is intended only for _free and open source_ projects who qualify and are approved by both the OSUOSL and
IBM. For proprietary sourced projects or products please use other POWER resources which can be found
[here](https://www.ibm.com/docs/en/linux-on-systems).

The POWER CI service uses Docker to deploy Jenkins workers. In the future we will add access to use OpenStack to deploy
Jenkins workers (ppc64le only).

{{< raw >}}

<div id="content">
<!-- Formsender error script -->
<script src="../../../js/formsender-error.js"></script>
  <form class="webform-client-form" enctype="multipart/form-data" action="https://formsender.osuosl.org:443"
  method="post" id="webform-client-form-1086" accept-charset="UTF-8">
    <div>
      <div class="form-item webform-component webform-component-textfield" id="webform-component-name">
        <label for="edit-submitted-name">Name <span class="form-required" title="This field is required.">&ast;</span>
        </label>
        <input type="text" id="edit-submitted-name" name="name" value="" size="60" maxlength="128" class="form-text
        required" />
      </div>
      <div class="form-item webform-component webform-component-email" id="webform-component-email">
        <label for="edit-submitted-email">Email <span class="form-required" title="This field is required.">&ast;</span>
        </label>
        <input class="email form-text form-email required" type="email" id="edit-submitted-email" name="email"
        size="60" />
      </div>
      <div class="form-item webform-component webform-component-textfield" id="webform-component-project-name">
        <div class="description">Name of the open source project or education institution this request will be
        supporting.</div>
        <label for="edit-submitted-project-name">Project Name <span class="form-required"
            title="This field is required.">&ast;</span></label>
        <input type="text" id="edit-submitted-project-name" name="project_name" value="" size="60" maxlength="128"
        class="form-text required" />
      </div>
      <div class="form-item webform-component webform-component-textfield" id="webform-component-project-url">
        <div class="description">Primary website URL for the open source project or education institution.</div>
        <label for="edit-submitted-project-url">Project URL <span class="form-required" title="This field is
        required.">&ast;</span></label>
        <input type="text" id="edit-submitted-project-url" name="project_url" value="" size="60" maxlength="128"
        class="form-text required" />
      </div>
      <div class="form-item webform-component webform-component-textfield" id="webform-component-community-size">
        <div class="description">How many estimated users do you have in your community?</div>
        <label for="edit-submitted-community-size">Estimated Size of User Community <span class="form-required"
        title="This field is required.">&ast;</span></label>
        <input type="text" id="edit-submitted-community-size" name="est_size_of_user_community" value="" size="60"
        maxlength="128" class="form-text required" />
      </div>
      <div class="form-item webform-component webform-component-textarea" id="webform-component-mission">
        <div class="description">Please describe in detail the mission and purpose of this request in regards to how
        the POWER architecture will support your project. Also describe the general mission of your project.</div>
        <label for="edit-submitted-mission">Description of Project Mission <span class="form-required" title="This field
        is required.">&ast;</span></label>
        <div class="form-textarea-wrapper resizable"><textarea id="edit-submitted-mission"
        name="description_of_project_mission" cols="60" rows="5" class="form-textarea required"></textarea></div>
      </div>
      <div class="form-item webform-component webform-component-textarea" id="webform-component-usage">
        <div class="description">What types of activity will the machine be used for? (i.e. compile builds, performance
        testing, architecture troubleshooting, etc).</div>
        <label for="edit-submitted-usage">Expected Usage Model <span class="form-required" title="This field is
        required.">&ast;</span></label>
        <div class="form-textarea-wrapper resizable"><textarea id="edit-submitted-usage" name="expected_usage_model"
        cols="60" rows="5" class="form-textarea required"></textarea></div>
      </div>
      <div class="form-item webform-component webform-component-textfield" id="webform-component-duration">
        <div class="description">How long do you expect you will need these resources? Ongoing or indefinitely are also
        acceptable answers.</div>
        <label for="edit-submitted-duration">Anticipated duration of need <span class="form-required" title="This field
        is required.">&ast;</span></label>
        <input type="text" id="edit-submitted-duration" name="anticipated_duration_of_need" value="" size="60"
        maxlength="128" class="form-text required" />
      </div>
      <div class="form-item webform-component webform-component-select" id="webform-component-deployment-timeframe">
        <div class="description">Normal turnaround for access is typically 7 business days. If you need it sooner than
        that, please choose which time frame you need. We will do our best to accommodate your request. </div>
        <label for="edit-submitted-deployment-timeframe">Deployment timeframe </label>
        <select id="edit-submitted-deployment-timeframe" name="deployment_timeframe" class="form-select">
          <option value="Within 7 business Days" selected="selected">Within 7 business Days</option>
          <option value="Within 3 business Days">Within 3 business Days</option>
          <option value="Within 1 business Days">Within 1 business Day</option>
        </select>
      </div>
      <div class="form-item webform-component webform-component-textarea" id="webform-component-other-information">
        <div class="description">Is there anything additional you would like to provide for your request?</div>
        <label for="edit-submitted-other-information">Other information </label>
        <div class="form-textarea-wrapper resizable"><textarea id="edit-submitted-other-information"
        name="other_information" cols="60" rows="5" class="form-textarea"></textarea></div>
      </div>
      <h4>POWER CI Access Question(s)</h4>
      <div class="form-item webform-component" id="webform-component-platforms">
        <div class="description">Some platforms may not be supported on a specific architecture, so please check with
            us first.</div>
        <label for="webform-component-platforms">OS Platform(s) <span class="form-required" title="This field is
        required.">&ast;</span></label>
        <div class="form-inline">
          <input type="checkbox" id="edit-submitted-centos" class="form-checkbox" name="platform_centos"
            value="requested" />
          <label for="edit-submitted-centos">CentOS</label>
        </div>
        <div class="form-inline">
          <input type="checkbox" id="edit-submitted-fedora" class="form-checkbox" name="platform_fedora"
            value="requested" />
          <label for="edit-submitted-fedora">Fedora</label>
        </div>
        <div class="form-inline">
          <input type="checkbox" id="edit-submitted-debian" class="form-checkbox" name="platform_debian"
            value="requested" />
          <label for="edit-submitted-debian">Debian</label>
        </div>
        <div class="form-inline">
          <input type="checkbox" id="edit-submitted-ubuntu" class="form-checkbox" name="platform_ubuntu"
            value="requested" />
          <label for="edit-submitted-ubuntu">Ubuntu</label>
        </div>
        <div class="form-inline">
          <input type="checkbox" id="edit-submitted-gentoo" class="form-checkbox" name="platform_gentoo"
            value="requested" />
          <label for="edit-submitted-gentoo">Gentoo</label>
        </div>
        <div class="form-inline">
          <input type="checkbox" id="edit-submitted-other" class="form-checkbox" name="platform_other"
            value="requested" />
          <label for="edit-submitted-other">Other (please specify in the "Other Information" field above)</label>
        </div>
      </div>
      <div class="form-item webform-component webform-component-select" id="webform-component-gpu">
        <div class="description">Thanks to a collaboration with the <a href="https://cgrb.oregonstate.edu/">Center for
        Genome Research and Biocomputing (CGRB)</a>, our POWER CI system does have access to GPU's via Jenkins. If you
        require GPU access, please answer "Yes".</div>
        <label for="edit-submitted-gpu">GPU Access</label>
        <select id="edit-submitted-gpu" name="gpu_access" class="form-select">
          <option value="No" selected="selected">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      <div class="form-item webform-component webform-component-textfield" id="webform-component-ci-github">
        <div class="description">We use GitHub OAuth to authenticate into the POWER CI system. Please provide a comma
        separated list of GitHub username(s) to gain access.</div>
        <label for="edit-submitted-ci-github">GitHub Username(s) for POWER CI <span class="form-required" title="This
        field is required.">&ast;</span></label>
        <input type="text" id="edit-submitted-ci-github" name="ci-github" value="" size="60" maxlength="128"
            class="form-text required" />
      </div>
      <p><i>You should receive an automated email from our request ticketing system to the email address you have
      provided within 5-10 minutes.  If you don't receive this email please reach out to us at <a
      href="mailto:powerci-request@osuosl.org">powerci-request@osuosl.org</a> or via IRC in <b>#osuosl</b> on
      <a href="https://libera.chat/">Libera Chat</a>.</i></p>
      <div class="g-recaptcha" data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div>
      <!-- Formsender Settings -->
      <input type="hidden" name="last_name" value="" />
      <input type="hidden" name="token"
        value="F0Ne39VckLbyzIrhHL2sYVL545kmgqx4rghGY3LulJTlut4oxLFIxky5xE32aHnrxHWHIP9F6fgvGY4G" />
      <input type="hidden" name="redirect" value="/form-submitted" />
      <input type="hidden" name="mail_subject_prefix" value="New POWER CI Request" />
      <input type="hidden" name="mail_subject_key" value="project_name" />
      <input type="hidden" name="send_to" value="PowerCI" />
      <!-- /Formsender Settings -->
      <div class="form-actions form-wrapper" id="edit-actions"><input type="submit" id="edit-submit" name="op"
      value="Submit" class="form-submit" /></div>
    </div>
  </form>
</div>
{{< /raw >}}
