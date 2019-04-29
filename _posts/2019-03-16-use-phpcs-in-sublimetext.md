---
layout: post
title:  "Cài đặt PHP CS cho Sublime Text"
author: tannguyen
categories: [ php ]
image: assets/images/post/2019-03-16/PHP-CS-Sublime-text.png
description: "Nếu bạn đang code PHP và thường xuyên mắc phải một số lỗi về coding convertion hoặc bạn muốn kiểm tra code mình đã chuẩn chưa thì hôm nay mình xin giới thiệu tới các bạn 1 plugins của sublimetext"
featured: true
hidden: true
---

Nếu bạn đang code PHP và thường xuyên mắc phải một số lỗi về coding convertion hoặc bạn muốn kiểm tra code mình đã chuẩn chưa thì hôm nay mình xin giới thiệu tới các bạn 1 plugins của sublimetext

Sau đây là một số package cần cài đặt trên máy của bạn. Và máy cá nhân mình đang dùng là Ubuntu 16.04 
 
### PHP Pear
```text
apt-get install php-pear
```
### PHP Code Sniffer (phpcs) Pear Package
```text
pear install PHP_CodeSniffer
```
Sau khi cài xong thì các bạn kiểm tra thử nó đã OK chưa nhé. 
```text
which phpcs
```
>/usr/bin/phpcs // Trả về như thế này là OK

### PHP Depends Pear Package
```text
pear channel-discover pear.pdepend.org
pear install pdepend/PHP_Depend
```

### PHP Mess Detector (phpmd) Pear Package
```text
pear channel-discover pear.phpmd.org
pear install phpmd/PHP_PMD
```
Tiếp tục kiểm tra xem thử <code>phpmd</code> đã được cài thành công chưa nhé

```text
which phpmd
```

>/usr/bin/phpmd // Trả về ntn là OK 

### Install PHP CS-Fixer
```text
curl http://get.sensiolabs.org/php-cs-fixer.phar -o /usr/local/bin/php-cs-fixer
chmod a+x /usr/local/bin/php-cs-fixer
```
### Install ocaml language interpreter
```text
apt-get install ocaml
```

### Install pfff
```text
cd /opt/
git clone --depth=1 https://github.com/facebook/pfff.git
./configure
make depend
make
make opt
```

### Install sublime-phpcs from Sublime Package Control.
 Các bạn vào đây để config <code>phpcs</code> cho Sublime :
 >Preferences > Package Settings > PHP Code Sniffer > Settings – User:
 
```text
{
    // Plugin settings

    // Turn the debug output on/off
    "show_debug": false,

    // Which file types (file extensions), do you want the plugin to
    // execute for
    "extensions_to_execute": ["php"],

    // Do we need to blacklist any sub extensions from extensions_to_execute
    // An example would be ["twig.php"]
    "extensions_to_blacklist": [],

    // Execute the sniffer on file save
    "phpcs_execute_on_save": true,

    // Show the error list after save.
    "phpcs_show_errors_on_save": true,

    // Show the errors in the gutter
    "phpcs_show_gutter_marks": true,

    // Show outline for errors
    "phpcs_outline_for_errors": true,

    // Show the errors in the status bar
    "phpcs_show_errors_in_status": true,

    // Show the errors in the quick panel so you can then goto line
    "phpcs_show_quick_panel": true,

    // The path to the php executable.
    // Needed for windows, or anyone who doesn't/can't make phars
    // executable. Avoid setting this if at all possible
    "phpcs_php_prefix_path": "",

    // Options include:
    // - Sniffer
    // - Fixer
    // - Mess Detector
    //
    // This will prepend the application with the path to php
    // Needed for windows, or anyone who doesn't/can't make phars
    // executable. Avoid setting this if at all possible
    "phpcs_commands_to_php_prefix": [],

    // What color to stylise the icon
    // https://www.sublimetext.com/docs/3/api_reference.html#sublime.View
    // add_regions
    "phpcs_icon_scope_color": "comment",


    // PHP_CodeSniffer settings

    // Do you want to run the phpcs checker?
    "phpcs_sniffer_run": true,

    // Execute the sniffer on file save
    "phpcs_command_on_save": true,

    // It seems python/sublime cannot always find the phpcs application
    // If empty, then use PATH version of phpcs, else use the set value
    "phpcs_executable_path": "",

    // Additional arguments you can specify into the application
    //
    // Example:
    // {
    //     "--standard": "PEAR",
    //     "-n"
    // }
    "phpcs_additional_args": {
        "--standard": "PSR2",
        "-n": ""
    },



    // PHP-CS-Fixer settings

    // Fix the issues on save
    "php_cs_fixer_on_save": false,

    // Show the quick panel
    "php_cs_fixer_show_quick_panel": false,

    // Path to where you have the php-cs-fixer installed
    "php_cs_fixer_executable_path": "",

    // Additional arguments you can specify into the application
    "php_cs_fixer_additional_args": {

    },



    // phpcbf settings

    // Fix the issues on save
    "phpcbf_on_save": false,

    // Show the quick panel
    "phpcbf_show_quick_panel": false,

    // Path to where you have the phpcbf installed
    "phpcbf_executable_path": "",

    // Additional arguments you can specify into the application
    //
    // Example:
    // {
    //     "--level": "all"
    // }
    "phpcbf_additional_args": {
        "--standard": "PSR2",
        "-n": ""
    },



    // PHP Linter settings

    // Are we going to run php -l over the file?
    "phpcs_linter_run": true,

    // Execute the linter on file save
    "phpcs_linter_command_on_save": true,

    // It seems python/sublime cannot always find the php application
    // If empty, then use PATH version of php, else use the set value
    "phpcs_php_path": "",

    // What is the regex for the linter? Has to provide a named match for 'message' and 'line'
    "phpcs_linter_regex": "(?P<message>.*) on line (?P<line>\\d+)",



    // PHP Mess Detector settings

    // Execute phpmd
    "phpmd_run": false,

    // Execute the phpmd on file save
    "phpmd_command_on_save": true,

    // It seems python/sublime cannot always find the phpmd application
    // If empty, then use PATH version of phpmd, else use the set value
    "phpmd_executable_path": "",

    // Additional arguments you can specify into the application
    //
    // Example:
    // {
    //     "codesize,unusedcode"
    // }
    "phpmd_additional_args": {
        "codesize,unusedcode,naming": ""
    },


    // PHP Scheck settings

    // Execute scheck
    "scheck_run": false,

    // Execute the scheck on file save
    "scheck_command_on_save": false,

    // It seems python/sublime cannot always find the scheck application
    // If empty, then use PATH version of scheck, else use the set value
    "scheck_executable_path": "",

    // Additional arguments you can specify into the application
    //
    //Example:
    //{
    //  "-php_stdlib" : "/path/to/pfff",
    //  "-strict" : ""
    //}
    "scheck_additional_args": {
        "-strict" : ""
    }
}
```
Save file này lại thì bây giờ có thể dùng PHP Code Sniffer trong Sublime rồi

Ngoài ra các bạn có thể cài thêm một số plugin như <code>phpfmt</code>

Nếu bạn cài <code>phpfmt</code> thì bạn có thể config thêm như dưới nhé.
```text
{
	"RemoveUseLeadingSlash": true,
	"autocomplete": true,
	"autoimport": true,
	"enable_auto_align": true,
	"format_on_save": true,
	"ignore": "Parent",
	"indent_with_space": 4,
	"passes":
	[
		"ReindentSwitchBlocks",
		"OrderAndRemoveUseClauses",
		"StripSpaceWithinControlStructures",
		"ShortArray",
		"SpaceBetweenMethods",
		"AutoSemicolon"
	],
	"psr2": true,
	"smart_linebreak_after_curly": true,
	"version": 4,
	"visibility_order": true,
	"yoda": true
}
```
