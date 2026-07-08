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
        'builder' => [
            'view builder',
            'add builder',
            'edit builder',
            'delete builder',
        ],
        'property types' => [
            'view property types',
            'add property type',
            'edit property type',
            'delete property type',
        ],

        'unit types' => [
            'view unit types',
            'add unit type',
            'edit unit type',
            'delete unit type',
        ],
        'project leads' => [
            'view project leads',
            'edit project leads',
            'add project lead followup',
        ],
        'customers' => [
            'view customers',
            'add customer',
            'edit customer',
            'delete customer',
        ],

        'channel partners' => [
            'view channel partners',
            'add channel partner',
            'edit channel partner',
            'delete channel partner',
        ],

        'bookings' => [
            'view bookings',
            'add booking',
            'edit booking',
            'delete booking',
        ],
        'commissions' => [
            'view commissions',
        ],
        'collections' => [
            'view collections',
            'add collection',
            'edit collection',
            'delete collection',
            'receive payment',
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

        'builder.index' => 'view builder',
        'builder-users.index' => 'view builder',
        'builder-users.create' => 'add builder',
        'builder-users.store' => 'add builder',
        'builder-users.edit' => 'edit builder',
        'builder-users.update' => 'edit builder',
        'builder-users.destroy' => 'delete builder',

        'property-types.index' => 'view property types',
        'property-types.create' => 'add property type',
        'property-types.store' => 'add property type',
        'property-types.edit' => 'edit property type',
        'property-types.update' => 'edit property type',
        'property-types.destroy' => 'delete property type',

        'unit-types.index' => 'view unit types',
        'unit-types.store' => 'add unit type',
        'unit-types.update' => 'edit unit type',
        'unit-types.destroy' => 'delete unit type',

        'project-leads.index' => 'view project leads',
        'project-leads.remark' => 'edit project leads',
        'lead-followup.store' => 'add project lead followup',

        'customers.index' => 'view customers',
        'customers.create' => 'add customer',
        'customers.store' => 'add customer',
        'customers.edit' => 'edit customer',
        'customers.update' => 'edit customer',
        'customers.destroy' => 'delete customer',

        'channel-partners.index' => 'view channel partners',
        'channel-partners.create' => 'add channel partner',
        'channel-partners.store' => 'add channel partner',
        'channel-partners.edit' => 'edit channel partner',
        'channel-partners.update' => 'edit channel partner',
        'channel-partners.destroy' => 'delete channel partner',
        'bookings.index' => 'view bookings',
        'bookings.create' => 'add booking',
        'bookings.store' => 'add booking',
        'bookings.edit' => 'edit booking',
        'bookings.update' => 'edit booking',
        'bookings.destroy' => 'delete booking',

        'commissions.index' => 'view commissions',
        'commissions.show' => 'view commissions',

        'collections.index' => 'view collections',
        'collections.create' => 'add collection',
        'collections.store' => 'add collection',
        'collections.edit' => 'edit collection',
        'collections.update' => 'edit collection',
        'collections.destroy' => 'delete collection',
        'collections.receive-payment' => 'receive payment',
    ],

];