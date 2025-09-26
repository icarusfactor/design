# Roundcube Design v0.8.9

![RoundCube Design View ](/images/rcdDesign089.png "In design mode.")

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
 I created the Design plugin to make custom HTML emails quick & easy. Anyone should be able to build their own template or use one from the installed examples with little effort for one off events or for medium sized family , friends or business lists that do not adhear to periodic release times. Wanted to keep it all simple and work within the Roundcube environment, so that no custom setup or duplication is needed. I wanted everyone wanting to try it to just install the plugin and run the setting setups and start to work on a email design right away and send it off when done.


### Key Elements: 
* Quick Start to Go Setup
* No Special Configurations
* Email Sending Is Left to Compose
* Uses Mbox Folders For Templates and Holding
* Works With all Major Browsers
* Editor Fonts Work With All Major Email Clients
* Make and Use Your Own Templates

### Status:
 This is a useful Beta version , previous release was usable but not functional ,this version fixed that and works for its intended purpose,but will have glitches and loss of active data may occur. So be sure to select HTML CODE mode and cut and paste the text of your customizations of the templates frequently and new versions can wildly change with each revsion at this time, until it reaches a stable version. For example if you make a template , future versions may not support it and may not be complatible or if you switch off of the design your changes are not saved. So use it as is.

### Benifits: 
* Make eye catching email with little effort.
* Be able to save templates to use again.
* Dont have to worry about confusing or overwhelming apllications to do this.

### Next Steps: 
 Now with the template system getting close to stable I plan to create more templates and parts, the current ones are good and can be used,but limited. I have added all of the supported fonts for email clients. Source mode will still need to be used for big changes and cut blocks or sections. Would like to add image connectors lke S3 and others. Still lots of bug fixes and better design flow to work on fixing while using the opensource SummerNote editor.

### BUGS:
  Issue with after duplicating a section of the template, and then jumping to zoom, the zoom view will be too small. Just click toggle zoom a couple of times and will work again. Also need to reset dynamic values once load in new template.They currently will get out of sync. Highlighting dynamic parts mostly works. Mostly. When new versions are released as of now its best to delete part and template directory and recreate and sync until stable.

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

### Contact:   
Daniel Yount
factor@userspace.org

### License: 
GPL-3.0-or-later


