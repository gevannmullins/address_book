<?php

$modules_menu = [];

$modules_menu = [
    "Dashboard" => [
        "info" => [
            "link_name" => "Dashboard",
            "link_url" => "/admin/dash",
            "description" => "Short description here."
        ]
    ],
    "Projects" => [
        "info" => [
            "link_name" => "Projects",
            "link_url" => "",
            "description" => "Short description here."
        ],
        "sub" => [
            [
                "link_name" => "Projects Dashboard",
                "link_url" => "/admin/projects/dash"
            ],
            [
                "link_name" => "Projects New",
                "link_url" => "/admin/projects/new"
            ],
            [
                "link_name" => "Projects All",
                "link_url" => "/admin/projects/all"
            ],
            [
                "link_name" => "Projects Dashboard",
                "link_url" => "/admin/projects/dash",
                "sub_sub" => [
                    [
                        "link_name" => "Project 1",
                        "link_url" => ""
                    ],
                    [
                        "link_name" => "Project 1",
                        "link_url" => ""
                    ],
                    [
                        "link_name" => "Project 1",
                        "link_url" => ""
                    ],
                    [
                        "Name" => "Project 1",
                        "Url" => ""
                    ],
                    [
                        "Name" => "Project 1",
                        "Url" => ""
                    ]
                ]

            ]
        ]
    ],
    "myProjects" => [
        "info" => [
            "link_name" => "myProjects",
            "link_url" => "/admin/dash",
            "description" => "Short description here."
        ],
        "sub" => [
            [
                "link_name" => "Project 1",
                "link_url" => "",
                "sub_sub" => [
                    [
                        "link_name" => "Project 1",
                        "link_url" => ""
                    ],
                    [
                        "link_name" => "Project 1",
                        "link_url" => ""
                    ]
                ]
            ],
            [
                "link_name" => "Project 2",
                "link_url" => ""
            ],
            [
                "link_name" => "Project 3",
                "link_url" => ""
            ],
            [
                "link_name" => "Project 4",
                "link_url" => "",
                "sub_sub" => [
                    [
                        "link_name" => "Project 1",
                        "link_url" => ""
                    ],
                    [
                        "link_name" => "Project 1",
                        "link_url" => ""
                    ],
                    [
                        "link_name" => "Project 1",
                        "link_url" => ""
                    ],
                    [
                        "link_name" => "Project 1",
                        "link_url" => ""
                    ]
                ]
            ]
        ]
    ],
    "CodeTests" => [
        "info" => [
            "link_name" => "CodeTests",
            "link_url" => "/admin/code_scripts",
            "description" => "Code snippets and tests."
        ],
        "sub" => [
            [
                "link_name" => "dataTables",
                "link_url" => "/admin/code_scripts/datatables"
            ],
            [
                "link_name" => "jQuery",
                "link_url" => "/admin/code_scripts/jquery"
            ]
        ]
    ],
    "UsefullScripts" => [
        "info" => [
            "link_name" => "usefullScripts",
            "link_url" =>"/admin/scripts",
            "description" => "Useful snippets and scripts"
        ],
        "sub" => [
            [
                "link_name" => "PHP",
                "link_url" => "/admin/scripts/php",
                "sub_sub" => [
                    [
                        "link_name" => "FileFolder",
                        "link_url" => "/admin/scripts/php/filefolder"
                    ],
                    [
                        "link_name" => "Database",
                        "link_url" => "/admin/scripts/php/databases"
                    ],
                    [
                        "link_name" => "Servers",
                        "link_url" => "/admin/scripts/php/servers"
                    ]
                ]
            ],
            [
                "link_name" => "JavaScript-JQuery",
                "link_url" => "/admin/scripts/js",
                "sub_sub" => [
                    [
                        "link_name" => "DOM",
                        "link_url" => "/admin/scripts/js/dom"
                    ]
                ]
            ],
            [
                "link_name" => "Python",
                "link_url" => "/admin/scripts/python"
            ]
        ]
    ],
    "Tutorials" => [
    "info" => [
        "link_name" => "Tutorials",
        "link_url" =>"/admin/tutorials",
        "description" => "Tutorials to learns from"
    ],
    "sub" => [
        [
            "link_name" => "PHP",
            "link_url" => "/admin/tutorials/php",
            "sub_sub" => [
                [
                    "link_name" => "FileFolder",
                    "link_url" => "/admin/tutorials/php/filefolder"
                ],
                [
                    "link_name" => "Database",
                    "link_url" => "/admin/tutorials/php/databases"
                ]
            ]
        ],
        [
            "link_name" => "JavaScript-JQuery",
            "link_url" => "/admin/tutorials/js",
            "sub_sub" => [
                [
                    "link_name" => "DOM",
                    "link_url" => "/admin/tutorials/js/dom"
                ]
            ]
        ],
        [
            "link_name" => "Python",
            "link_url" => "/admin/tutorials/python"
        ]
    ]
]
];