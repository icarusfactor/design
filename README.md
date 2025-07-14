# Roundcube Design v0.5

![RoundCube Design View ](/images/RCdesign.png "In design mode.")

### Install 

1. Copy design directory to plugins directory: /path/to/roundcube/plugins/

2. Enable plugin in the main RoundCube config file. config/config.inc.php

3. In above file look for $config['plugins'] section and add design to the list.

4. Should like like $config['plugins'] = array('plugin1', 'plugin2', 'design');

5. Log into Roundcube webmail and click Design and navigate to Settings to follow next steps.

### Setup: 
1. Under Settings click "Create / Check" to create the template mailbox.

This will be used to store templates and if flagged will be recognized by
template dropdwon in Design. No more than 10 templates are recognized.

2. Click "Install Templates" to get started quick with some default
templates to work off of.

3.  When changes to template mailbox are made, be sure to click "SYNC"
to update them in Design.

### Objectives: 
 I created the Design plugin to make custom HTML emails quick & easy. Anyone should be able to build their own template or use one from the installed examples with little effort for one off events or for medium sized family , friends or business lists that do not adhear to periodic release times. Wanted to keep it all simple and work within the Roundcube environment, so that no custom setup or duplication is needed. I wanted everyone wanting to try it to just install the plugin and run the setting setups and start to work on a email design right away and send it off when done.


### Key Elements: 
* Quick Start to Go Setup
* No Special Configurations
* Email Sending Is Left to Compose
* Uses Mbox Folders For Templates and Holding
* Works With all Major Browsers
* Make and Use Your Own Templates

### Status:
 This is an early Beta version , but is usable and does work for its intended purpose,but will have glitches and loss of active data may occur. So be sure to select HTML CODE mode and cut and paste the text of your customizations of the templates frequently and new versions can wildly change with each revsion at this time, until it reaches a stable version. For example if you make a template , future versions may not support it and may not be complatible or if you switch off of the design your changes are not saved. So use it as is.


### Benifits: 
* Make eye catching email with little effort.
* Be able to save templates to use again.
* Dont have to worry about confusing or overwhelming apllications to do this.

### Next Steps: 
 I plan to create more templates to pull from, add more fonts to use and add a way to select theme color or background element color changes. This needs to be done manually currently in source mode. Need to add session saving in Design view, currently if you go away from Design mode, it will be gone and will have to start new. Would like to add S3 image storage configuration to keep the email small and not have to retype remote locations when adding image URLs. Lots of bug fixes and better design flow.


### Contact:   
Daniel Yount
factor@userspace.org

### License: 
GPL-3.0-or-later


