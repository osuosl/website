---
title: Open-CE
author: Ken Lett
slug: services/powerdev/opence
---

The Open Source Lab (OSUOSL) and Center for Genome Research and Biocomputing (CGRB) partner with IBM and OpenPOWER in order to provide a download resources around Open-CE. Open-CE is a community driven software distribution for machine learning that runs on standard Linux platforms with NVIDIA GPU technologies.

[Current release](#current-release)
[Previous releases](#previous-releases)

.. _Current release:

.. _Release 1.7.2:

Open-CE Release 1.7.2 {#id .className attrName="current-release"}
---------------------

*Release date: 09/29/2022*

This is bug fix release 2 of release 1.7

**What's new**

- Various build fixed
- Upadated packages

  - TensorFlow  2.9.2
  - xgboost 1.6.2
  - DALI  1.16.1
  - Ray 1.13.1
  - PyTorch Geometric 2.1.0
  - numba 0.56.1
  - snapml  1.8.10
  - TF Serving  2.9.2

**Learn more**

Get information about planning, configuring, and managing Open-CE 1.7 Below:

- `Planning`_
- `System setup`_
- `Setting up the software repository`_
- `Creating conda environments`_ (recommended)
- `Installing the MLDL frameworks`_
- `Uninstalling the MLDL frameworks`_

.. _planning:

Planning
--------

We recommend users use one of the listed operating systems listed below. This is a standard conda repository and can be added to any conda install. Conda must be configured to give priority to installing packages from this channel.

.. _system setup:

System setup
------------

Open-CE can be installed and run directly on a bare-metal RHEL and Ubuntu based systems.

Supported hardware:
^^^^^^^^^^^^^^^^^^^

- IBM Power System IC922 with NVIDIA Tesla T4 GPUs
- IBM Power System AC922 with NVIDIA Tesla V100 GPUs
- IBM Power System S822LC with NVIDIA Tesla P100 GPUs
- x86_64 systems with NVIDIA Tesla V100 or P100 GPUs

- Supported operating systems:

  - Red Hat Enterprise Linux for POWER LE 7.8, 8.x
  - Community Enterprise Operating System (CentOS) 7.8, 8.x
  - Ubuntu 20.04.1

- Required 3rd party software:

  - NVIDIA GPU driver 440.33 - 520.61
  - CUDA driver 11.2 or 11.4

Installing the Open-CE Repository and Frameworks
------------------------------------------------

.. _Setting up the software repository:

Setting up the software repository
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The Open-CE MLDL packages are distributed as conda packages in an online conda repository. Conda must be configured to give priority to installing packages from this channel.

Add the Open-CE channel to the conda configuration by running the following command:

.. code-block:: bash

  conda config --prepend channels https://ftp.osuosl.org/pub/open-ce/current/

.. _Creating conda environments:

Creating conda environments (recommended)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

With conda, you can create environments that have different versions of Python or packages installed in them. Conda environments are optional but recommended. If not used, packages are installed in the default environment called base, which often has a higher risk of containing conflicting packages or dependencies. Switching between environments is called activating the environment.

The syntax to create and activate a conda environment is:

.. code-block:: bash

  conda create --name <environment name> python=<python version> conda activate <environment name>

Note: It is recommended that you specify the Python version when creating a new environment. If you do not specify the version, Python 3.7 is installed when any package that requires Python are installed.

The only valid Python versions with Open-CE are Python 3.8, 3.9 and 3.10

For example, to create an environment named opence_env with Python 3.9:

.. code-block:: bash

  conda create --name opence_env python=3.9 conda activate opence_env

For more information on what you can do with conda environment see https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html.

Note: Open-CE should be run as a non-privileged user and not root. The Open-CE components are designed to be usable by normal users, and the pre-installed docker images provide a non-root user by default. Some of the Open-CE components will give warnings or will fail when run as root.


.. _Installing the MLDL frameworks:

Installing frameworks individually
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can install the MLDL frameworks individually. The framework packages include the following versions.

**Table 1. Framework packages (Open-CE 1.7.2)**


===================================  ===============================  ==========  ====================  ===================
Package                              Description                      Version     Available on ppc64le  Available on x86_64
===================================  ===============================  ==========  ====================  ===================
``av``                               AV                               8.0.3       X                     X
``bazel``                            Bazel                            5.1.1       X                     X
``boost_mp11``                       Boost MP11                       1.76.0      X                     X
``cli11``                            CLI11                            2.2.0       X                     X
``cpp-filesystem``                   CPP Filesystem                   1.5.8       X                     X
``cudatoolkit``                      Cuda Toolkit                     11.4.4      X                     X
``cudatoolkit-dev``                  Cuda Toolkit Dev                 11.4.4      X                     X
``cudnn``                            Cudnn                            8.3.0.98    X                     X
``dali``                             DALI                             1.16.1      X                     X
``dm-tree``                          DM-Tree                          0.1.5       X                     X
``grpc``                             GRPC                             1.41.0      X                     X
``gtest``                            GTest                            1.10.0      X                     X
``horovod``                          Horovod                          0.25.0      X                     X
``huggingface_hub``                  Huggingface Hub                  0.6.0       X                     X
``jpeg-turbo``                       JPEG Turbo                       2.1.0       X                     X
``keras``                            Keras                            2.9.0       X                     X
``langcodes``                        Langcodes                        3.3.0       X                     X
``libdate``                          Date                             3.0.1       X                     X
``libflac``                          Flac                             1.3.3       X                     X
``libiconv``                         IConv                            1.16        X                     X
``libsndfile``                       SndFile                          1.0.31      X                     X
``libsolv``                          Solv                             0.7.19      X                     X
``lightgbm``                         LightGBM                         3.3.2       X                     X
``magma``                            Magma                            2.6.1       X                     X
``mamba``                            Mamba                            0.25.1      X                     X
``nccl``                             NCCL                             2.12.7      X                     X
``nlohmann_json``                    Nlohmann JSON                    3.10.5      X                     X
``numactl``                          NumaCtl                          2.0.12      X                     X
``onnx-runtime``                     Onnx-runtime                     1.12.1      X                     X
``onnx``                             ONNX                             1.12        X                     X
``onnxconverter-common``             onnxconverter-common             1.9.0       X                     X
``onnxmltools``                      ONNX ML Tools                    1.11.1      X                     X
``openblas``                         OpenBLAS                         0.3.20      X                     X
``opencv``                           OpenCV                           4.6.0       X                     X
``openmpi``                          OpenMPI                          4.1.1       X                     X
``optional-lite``                    Optional Lite                    3.4.0       X                     X
``orc``                              ORC                              1.7.4       X                     X
``pyarrow``                          PyArrow                          8.0.0       X                     X
``pybind11-abi``                     PyBind11                         4           X                     X
``pyDeprecate``                      PyDeprecate                      0.3.2       X                     X
``pyTorch-lightning-bolts``          PyTorch Lightning Bolts          0.5.0       X                     X
``pytorch-lightning``                PyTorch Lightning                1.6.5       X                     X
``pytorch_geometric``                PyTorch Geometric                2.1,0       X                     X
``pytorch_scatter``                  PyTorch Scatter                  2.0.8       X                     X
``pytorch_sparse``                   PyTorch Sparse                   0.6.10      X                     X
``pytorch``                          PyTorch for Cuda 11.2            1.10.2      X                     X
``pytorch``                          PyTorch for Cuda 11.4, CPU       1.12.1      X                     X
``ray_all``                          Ray                              1.13.1      X                     X
``ray-tune``                         Ray Tune                         1.13.1      X                     X
``reproc``                           Reproc                           14.2.3      X                     X
``sacremoses``                       Sacremoses                       0.0.53      X                     X
``safeint``                          SafeInt                          3.0.26      X                     X
``sentencepiece``                    SentencePiece                    0.1.96      X                     X
``skl2onnx``                         skl2onnx                         1.12.0      X                     X
``spacy``                            Spacy                            3.3.1       X                     X
``spacy-legacy``                     Spacy Legacy                     3.0.9       X                     X
``spacy-loggers``                    Spacy Loggers                    1.0.2       X                     X
``spdlog``                           SPDLog                           1.9.2       X                     X
``tensorboard-data-server``          TensorBoard Data Server          0.6.1       X                     X
``tensorboard``                      TensorBoard                      2.9.1       X                     X
``tensorflow-addons``                TensorFlow Addons                0.17.0      X                     X
``tensorflow-datasets``              TensorFlow Datasets              4.6.0       X                     X
``tensorflow-estimators``            TensorFlow Estimators            2.9.0       X                     X
``tensorflow-hub``                   TensorFlow Hub                   0.12.0      X                     X
``tensorflow-io-gcs-filesystem``     TensorFlow GCS Filesystem        0.26.0      X                     X
``tensorflow-metadata``              TensorFlow MetaData              1.8.0       X                     X
``tensorflow-model-optimizations``   TensorFlow Model Optimizations   0.7.3       X                     X
``tensorflow-probability``           TensorFlow Probability           0.17.0      X                     X
``tensorflow-text``                  TensorFlow Text                  2.9.0       X                     X
``tensorflow-base``                  Tensorflow                       2.9.2       X                     X
``tf2onnx``                          Tensorflow2ONNX                  1.11.1      X                     X
``tokenizers``                       Tokenizers                       0.11.4      X                     X
``torchtext-base``                   TorchText for CUDA 11.2          0.11.2      X                     X
``torchtext-base``                   TorchText for CUDA 11.4, CPU     0.13.1      X                     X
``torchvision-base``                 TorchVision for CUDA 11.2        0.11.3      X                     X
``torchvision-base``                 TorchVision for CUDA 11.4, CPU   0.11.3      X                     X
``transformers``                     Transformers                     4.19.2      X                     X
``typeguard``                        TypeGuard                        2.12.0      X                     X
``uwsgi``                            UWSGI                            2.0.20      X                     X
``xgboost``                          XGBoost                          1.6.2       X                     X
``yaml-cpp``                         YAML CPP                         0.6.3       X                     X
===================================  ===============================  ==========  ====================  ===================


With the conda environment activated, run the following command:

.. code-block:: bash

  conda install <package name>

.. _Uninstalling the MLDL frameworks:

Uninstalling the Open-CE MLDL frameworks
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Find information about uninstalling machine learning and deep learning MLDL frameworks.

The MLDL framework packages can be uninstalled individually, or you can uninstall all of the MLDL packages at the same time.

If the frameworks are installed into a separate conda environment, all of the frameworks can be removed by simply deleting the environment:

.. code-block:: bash

  conda env remove -n <environment name>

Individual frameworks (and any packages that depend on them) can be removed by removing the individual package:

.. code-block:: bash

  conda remove <package name>

Important: This command removes the specified packages and any packages that depend on any of the specified packages. If you want to skip this dependency checking and remove just the requested packages, add the --force option. However, this may break your environment, so use this option with caution.


Previous releases
^^^^^^^^^^^^^^^^^

We recommend that you install the most current release of Open-CE, however, if you have an earlier version installed, you can find information below:

.. _Previous releases:

Previous releases
-----------------


.. _Release 1.6.1:

Open-CE Release 1.6.1
---------------------

*Release date: 05/19/2022*

This is bug fix release 1 of release 1.6

**What's new**

- Various build fixed
- Upadated packages

  - pytorch-lightning 1.6.3
  - pyDeprecate 0.3.2
  - torchmetrics  0.8.2
  - tensorflow-io-gcs-filesystem  0.25.0
  - ray 1.11.1


.. _Release 1.5.1:

Open-CE Release 1.5.1
---------------------

*Release date: 01/11/2021*

This is bug fix release 1 of release 1.5

**What's new**

Key changes include:

Refresh PyTorch to v1.10.1
remove py36 blocks and dataclasses from all recipes
Update DALI to 1.9 (from 1.9-dev)
Update tensorflow metadata to 1.5.0
Enable uwsgi for python version 3.9

.. _Release 1.5.0:


Open-CE Release 1.5.0
---------------------

*Release date: 12/08/2021*

**What's new**

This is release 1.5.0 of the Open Cognitive Environment (Open-CE), codenamed Otter

This release of Open-CE supports NVIDIA's CUDA versions 10.2,11.2 as well as Python 3.7,3.8,3.9.


.. _Release 1.4.1:


Open-CE Release 1.4.1
---------------------

*Release date: 10/10/2021*

**What's new**

This is bug fix 1 of release 1.4 of Open Cognitive Environment (Open-CE). Main updates are:

- TensorFlow is now at 2.6.2
- PyTorch is now at 1.9.1
- The DALI recipe now builds on both x86 and ppc.
- Bug Fix Changes
- Changes For open-ce
- Release updates for 1.4.1 (#545)
- Use updated uwsgi 2.0.20 from conda-forge (#544)
- Pin updates for 1.4.1 (#540)
- Update OpenCV to v3.4.16 (#open-ce/opencv-feedstock#27)
- Update Tensorflow Probability to v0.14.1 (#open-ce/tensorflow-probability-feedstock#19)
- Update pytorch-lightning to 1.4.9 and torchmetrics to v0.5.1 (#open-ce/pytorch-lightning-feedstock#24)

For a complete list of changes also see the `1.4.0 release`_.

.. _1.4.0 release: https://github.com/open-ce/open-ce/releases/tag/open-ce-v1.4.0

.. _Release 1.3.1:


Open-CE Release 1.3.1
---------------------

*Release date: 08/26/2021*

**What's new**

This is bug fix 1 of release 1.3 of Open Cognitive Environment (Open-CE), code named Chipmunk.
Bug Fix Changes

- Fix uwsgi build #470 #474
- Adjust h5py pins for py39 #473 #482
- enable open-cv build directly in opence-env.yaml #477
- Move feedstock patches directory into /envs #484
- Update OpenBLAS to 0.3.13 #479
- Add pin for ICU #493
- adjust build resources for TensorFlow builds open-ce/tensorflow-feedstock#58 open-ce/tensorflow-feedstock#59
- TensorFlow: update to 2.5.1 open-ce/tensorflow-feedstock#61
- Pytorch: use TBB for CPU and OpenMP for GPU open-ce/pytorch-feedstock#68
- Horovod: use system compilers when using system MPI open-ce/horovod-feedstock#28
- LightGBM: use system compilers when using system MPI open-ce/LightGBM-feedstock#21
- OpenCV: disable LAPACK temporarily open-ce/opencv-feedstock#19

For a complete list of changes also see the `1.3.0 release`_.

.. _1.3.0 release: https://github.com/open-ce/open-ce/releases/tag/open-ce-v1.3.0


.. _Release 1.2.2:


Open-CE Release 1.2.2
---------------------

*Release date: 06/16/2021*

**What's new**

This is release 1.2.2 of Open Cognitive Environment (Open-CE).

This is bug fix 2 of release 1.2 of Open Cognitive Environment (Open-CE), code named Prairiedog.

Bug Fix Changes

- libgcc and libstdc++ were pinned to cos6 versions to allow for compilation with GCC 7.2/7.3 #433
- TensorFlow was updated to version 2.4.2
- Dependency pins were loosened for networkx, requests, scipy and werkzeug #439
- Changed PyArrow to build with -O2 optimizations to avoid a compiler error in GCC 7.x
- Add patch to PyArrow to fix handling of decimal types with negative scale in C data import


Previously, the Open-CE build tools were part of the `Open-CE repository`_. `They can now be found in their own repo`_.

A release of Open-CE now only includes:
- The Open-CE env files used to generate a conda channel containing all of the packages that are part of an Open-CE release.
- A collection of feedstocks containing conda recipes for building the packages that are part of an Open-CE release.

**New Features**
- PyArrow is now included as part of Open-CE.
- The protobuf version that all Open-CE packages use is now set to 3.11.2.
- TensorFlow serving was removed, due to its incompatibility with protobuf 3.11.2

**Bug Fix Changes**
- The conda hash string has been removed from the name of all noarch packages.
- The version of sqlite that TensorFlow uses is now explicitly set 38 39.

- Open-CE is distributed as prebuilt containers, or on demand through the Conda provisioning process.

  - All of the Conda packages are available in a `Open-CE Conda channel`_
  - Conda packages are available in the `Open-CE 1.2.0 Conda channel`_
  - There is no install package to download, instead connect to the Conda channel and install your packages from there
  - Package dependencies are automatically resolved
  - Delivery of packages is open and continuous
  - Enable Python versions 3.6, 3.7, 3.8
  - You can run more than one framework at the same time in the same environment. For example, you can run TensorFlow and PyTorch at the same time.

.. _They can now be found in their own repo: https://github.com/open-ce/open-ce-builder
.. _Open-CE Conda channel: https://ftp.osuosl.org/pub/open-ce/
.. _Current Open-CE Conda channel: https://ftp.osuosl.org/pub/open-ce/current
.. _Open-CE repository: https://github.com/open-ce
.. _Open-CE 1.2.0 Conda channel: https://ftp.osuosl.org/pub/open-ce/1.2.0



.. _Release 1.2.0:

Open-CE Release 1.2.0
---------------------

*Release date: 04/16/2021*

**What's new**

This is release 1.2 of Open Cognitive Environment (Open-CE), code named Prairiedog.

Previously, the Open-CE build tools were part of the `Open-CE repository`_. `They can now be found in their own repo`_.

A release of Open-CE now only includes:
- The Open-CE env files used to generate a conda channel containing all of the packages that are part of an Open-CE release.
- A collection of feedstocks containing conda recipes for building the packages that are part of an Open-CE release.

**New Features**
- PyArrow is now included as part of Open-CE.
- The protobuf version that all Open-CE packages use is now set to 3.11.2.
- TensorFlow serving was removed, due to its incompatibility with protobuf 3.11.2

**Bug Fix Changes**
- The conda hash string has been removed from the name of all noarch packages.
- The version of sqlite that TensorFlow uses is now explicitly set 38 39.

- Open-CE is distributed as prebuilt containers, or on demand through the Conda provisioning process.

  - All of the Conda packages are available in a `Open-CE Conda channel`_
  - Conda packages are available in the `Open-CE 1.2.0 Conda channel`_
  - There is no install package to download, instead connect to the Conda channel and install your packages from there
  - Package dependencies are automatically resolved
  - Delivery of packages is open and continuous
  - Enable Python versions 3.6, 3.7, 3.8
  - You can run more than one framework at the same time in the same environment. For example, you can run TensorFlow and PyTorch at the same time.

.. _They can now be found in their own repo: https://github.com/open-ce/open-ce-builder
.. _Open-CE Conda channel: https://ftp.osuosl.org/pub/open-ce/
.. _Current Open-CE Conda channel: https://ftp.osuosl.org/pub/open-ce/current
.. _Open-CE repository: https://github.com/open-ce
.. _Open-CE 1.2.0 Conda channel: https://ftp.osuosl.org/pub/open-ce/1.2.0


.. _Release 1.1.1:

Open-CE Release 1.1.1
---------------------

*Release date: 01/12/2021*

**What's new**

This is release 1.1 of Open Cognitive Environment (Open-CE), code named Meerkat.

- Added support for CUDA 11.0, which is currently supported on RHEL8.
- Added recipes for the following new packages: LightGBM, TensorFlow Model Optimization, TensorFlow Addons, PyTorch Lightning Bolts, Python Flatbuffers.
- Added the open-ce tool for running build and validate commands. This replaces the previously existing build_env.py and build_feedstock.py entry points to Open-CE.
- Added the open-ce test commands to test packages that are built by Open-CE.
    open-ce build env will now output conda environment files that can be used to create conda environments containing the packages that were just built.
- The open-ce build image command has been added to create Docker images from the output of open-ce build env.
- Open-CE build tools can now accept --cuda_versions as an argument to choose a version of CUDA to build with.
- open-ce build env will now check for circular dependencies between packages.
- open-ce build env will verify that all packages that are being built can be installed within the same conda environment before starting a build.
- Added the --skip_build_packages argument to open-ce build env.
- Jinja can now be used within any Open-CE configuration file.
- Improved performance when attempting to build packages that already exist.
- Added the patches key to the Open-CE environment files to allow for patching feedstocks.

.. _Open-CE Conda channel: https://ftp.osuosl.org/pub/open-ce/
.. _Current Open-CE Conda channel: https://ftp.osuosl.org/pub/open-ce/current


.. _Release 1.0.0:

Open-CE Release 1.0.0
---------------------

*Release date: 11/10/2020*

**What's new**

Open-CE 1.0 is the `current release`_ of Open-CE and includes the following features:

- conda packages are now available on ppc64le.
- conda packages are now available on x86.
- TensorFlow 2.3.1
- PyTorch 1.6.0
- Open-CE is distributed as prebuilt containers, or on demand through the Conda provisioning process.

  - All of the Conda packages are available in a `Open-CE Conda channel`_
  - Conda packages are available in the `Open-CE 1.0.0 Conda channel`_
  - There is no install package to download, instead connect to the Conda channel and install your packages from there
  - Package dependencies are automatically resolved
  - Delivery of packages is open and continuous
  - Enable Python versions 3.6, 3.7, 3.8
  - You can run more than one framework at the same time in the same environment. For example, you can run TensorFlow and PyTorch at the same time.

.. _Open-CE Conda channel: https://ftp.osuosl.org/pub/open-ce/
.. _Open-CE 1.0.0 Conda channel: https://ftp.osuosl.org/pub/open-ce/1.0.0