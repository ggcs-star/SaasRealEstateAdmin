<?php

return [

    'modules' => [

        'roles' => [
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
        ],

        'users' => [
            'view users',
            'assign role',
        ],

        'projects' => [
            'view project',
            'add project',
            'edit project',
            'delete project',
        ],
        'amenities' => [
            'view amenities',
            'add amenity',
            'edit amenity',
            'delete amenity',
        ],
        'categories' => [
            'view categories',
            'add category',
            'edit category',
            'delete category',
        ],
        'promoters' => [
            'view promoters',
            'add promoter',
            'edit promoter',
            'delete promoter',
        ],

    ],

    
    'route_map' => [

        // Roles
        'roles.index' => 'view roles',
        'roles.create' => 'create roles',
        'roles.store' => 'create roles',
        'roles.manage' => 'edit roles',
        'roles.updatePermissions' => 'edit roles',

        // Users
        'users.index' => 'view users',
        'users.assignRole' => 'assign role',

        // Projects
        'projects.index' => 'view project',
        'projects.create' => 'add project',
        'projects.store' => 'add project',
        'projects.edit' => 'edit project',
        'projects.update' => 'edit project',
        'projects.delete' => 'delete project',

        'amenities.index' => 'view amenities',
        'amenities.store' => 'add amenity', 
        'amenities.update' => 'edit amenity',
        'amenities.destroy' => 'delete amenity',

        'categories.index' => 'view categories',
        'categories.store' => 'add category',   
        'categories.update' => 'edit category',
        'categories.destroy' => 'delete category',

        'promoters.index' => 'view promoters',
        'promoters.store' => 'add promoter',
        'promoters.update' => 'edit promoter',
        'promoters.destroy' => 'delete promoter',
    ],

];