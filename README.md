# Roundcube Design v0.9.2

![RoundCube Design View ](/images/rcDesign091.png "In design mode.")

### Install 

1. Copy design directory to plugins directory: /path/to/roundcube/plugins/

2. Enable plugin in the main RoundCube config file. config/config.inc.php

3. In above file look for $config['plugins'] section and add design to the list.

4. Should like like $config['plugins'] = array('plugin1', 'plugin2', 'design');

5. Log into Roundcube webmail and click Design and navigate to Settings to follow next steps.

### Setup: 
1.  Under Settings click "Create / Check" on both template and part mailbox
to create them. These folders will be used to store templates and one for parts
and if flagged will be recognized by template and part dropdown in Design. No
more than 10 templates or parts are recognized.

2.  Click "Install Templates" and "Install Parts" to get started quick with some
default templates and parts to work off of.

3.  When changes to template or part mailbox are made, be sure to click "SYNC"
to update them in Design.

4.  After these steps are done you can click top menu "Design" and should
be able to see the demo templates in the Template dropdown and parts in the Part
dropdown and be able to select and add them if Template is active.


### Special Keys:
 For now to make the usibility of the visual edtior more userfriendly becasue multiple popups for items may occur. Below are the keys to raise specific control above another if this action takes place. Once the key is released the behaviour goes back to normal.

* ALT Raises table controls.
* CTRL Raises link controls.
* ALT + CTRL Raises image controls.

### Objectives: 
 I created the Design plugin to make custom HTML emails quick & easy. Anyone should be able to build their own template and parts or use one from the installed examples with little effort for one off events or for medium sized friends or business lists that do not adhear to periodic release times. Wanted to keep it all simple and work within the Roundcube environment, so that no custom setup or duplication is needed. I wanted everyone wanting to try it to just install the plugin and run the setting setups and start to work on a email design right away and send it off when done.


### Key Elements: 
* Quick Start Plugin And Play Setup.
* No Special Configurations
* Email Sending Is Left to Compose
* Uses Mbox Folders For Templates and Holding
* Works With all Major Browsers
* Editor Fonts Work With All Major Email Clients
* Make and Use Your Own Templates

### Status:
With the functionality to save templates and parts locally on a seprate device one should be able to save parts for use and install later so no loss of custom templates could take place. Now on to the refactoring phase. 

### Benifits: 
* Make eye catching email with little effort.
* Be able to make and save templates to use quickly again.
* Dont have to worry about confusing or overwhelming apllications to do this.

### Next Steps: 
 I've Made it to the final phase and will be limiting feature adds, not a freeze, but will be working on refactoring code and making it stable up to version 1.0. All of the base functionalilty has been added,from install to removing templates, export and importing templates and parts from local devices, create and making custom templates and parts visually or just use the default ones. I'll be adding the email list and image connectors after 1.0 and will be a Wordpress based plugin. The database of the Wordpress site will host the email images from its Media Library and site url and will gather list emails from a Wordpress block to add to the RoundCube Listcommnads plugin capability.  

### Template Rules:
 When making a template some rules need to be followed when making one from scratch or modifying a current one that the editor will recognizes and parse accordingly.

### DYNAMIC TEMPLATE SPECIFICATION VERSION 1.1
*  The first line of a editable template is as follows **&lt;!-- DYNAMIC V1.1 --&gt;** otherwise options will be disabled and concidered as a FIXED template. 
* The **div** tag can not be used for any content and is for control,it will only hold sections of html that can have content. Although can be made to have a border.
* The **table** tag is the main content element. Summernote editor popups for changing attrbutes and color are limited to this. 
* The **img** tag can only be used from remote store locations like S3 or direct website links via URL.
* To tag a div that its id will hold specific content, Options as folows.

* **rcd_template** : First div and used by dom to detect document is a template
* **rcd_document** : The main div that holds other designated divs.
* **rcd_header** : This holds Logo and branding site data.
* **rcd_content** : The div that holds other general divs.
* **rcd_div** : General use section within the main content holder.
* **rcd_footer** : Attached to bottom of content div for various contact & site links.
* **rcd_container** : Only for part items, will be for packs, not used for that yet. 

### File extentions used.
* **filename.rcdt** : File extention used for fixed or dynamic templates.
* **filename.rcdp** : File extention used for template parts.


### Contact:   
Daniel Yount
factor@userspace.org

### License: 
GPL-3.0-or-later


