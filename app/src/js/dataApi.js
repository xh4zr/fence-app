app.factory('api', function(){
	var factory = {};

	factory.data = [{
			name:'Trex Composite',
			icon:'img/Small-Trex.jpg',
			colors: [{name:'Saddle',src:'img/saddle.png'}, {name:'Winchester Grey',src:'img/wgrey.png'}, {name:'Woodland Brown',src:'img/wb.png'}],
			sizes: [{name:'3 foot',length:8}, {name:'6 foot',length:8}],
			styles: ['Flat Top'],
			sectionComponents: [{
				name:'6\' Pickets',
				value:19
			},{
				name:'8\' Top Rail',
				value:1
			},{
				name:'8\' Bottom Rail',
				value:2
			},{
				name:'8\' Aluminum Bottom Rail Insert',
				value:1
			},{
				name:'8\' Top Rail',
				value:1
			},{
				name:'Brackets',
				value:4
			}],
			ppf:2.375,
			gate: {
				small:[{
					name:'Steel Post Insert',
					value:1
				},{
					name:'Gate Hardware',
					value:1
				},{
					name:'Gate Panel (Standard)',
					value:1
				}],
				large:[{
					name:'Steel Post Insert',
					value:1
				},{
					name:'Gate Hardware',
					value:1
				},{
					name:'Gate Panel (Large)',
					value:1
				}]
			}
		},{
			name:'Fortress Iron',
			icon:'img/Small-Fortress.jpg',
			colors: [{name:'Black',src:'img/black.jpg'}],
			sizes: [{name:'4 foot',length:8}, {name:'6 foot',length:8}],
			styles: ['Spear Top', 'Flat Top', 'Extended Top'],
			sectionComponents: [{
				name:'8\' Panel',
				value:1
			},{
				name:'Brackets',
				value:4
			}],
			gate: {
				small:[{
					name:'Gate Hardware',
					value:1
				},{
					name:'Gate Panel (Standard)',
					value:1
				}],large:[{
					name:'Gate Hardware',
					value:1
				},{
					name:'Gate Panel (Large)',
					value:1
				}]
			}
		},{
			name:'Cedar Wood',
			icon:'img/Small-Cedar.jpg',
			colors: [{name:'No Color Options'}],
			sizes: [{name:'3 foot',length:8}, {name:'6 foot',length:8}],
			styles: ['Flat Top', 'Dog Ear'],
			sectionComponents: [{
				name:'6\' Pickets',
				value:16
			},{
				name:'2x4x8\' Rail',
				value:2
			},{
				name:'Brackets',
				value:4
			}],
			ppf:2.1,
			gate: {
				small:[{
					name:'6\' Pickets',
					value:8
				},{
					name:'2x4x8\' Rail',
					value:1
				},{
					name:'Gate Hardware',
					value:1
				}],
				large:[{
					name:'6\' Pickets',
					value:16
				},{
					name:'2x4x8\' Rail',
					value:3
				},{
					name:'Gate Hardware',
					value:1
				}]
			}
		},{
			name:'SimTek Composite',
			icon:'img/Small-Simtek.jpg',
			colors: [{name:'White'}, {name:'Grey'}, {name:'Black'}, {name:'Red'}],
			sizes: [{name:'3 foot',length:6}, {name:'4 foot',length:8}, {name:'6 foot',length:6}],
			styles: ['No Style Options'],
			sectionComponents: [{
				name:'6\' Panel',
				value:1
			},{
				name:'Brackets',
				value:4
			}],
			gate: {
				small:[{
					name:'Steel Gate Post',
					value:1
				},{
					name:'Gate Hardware',
					value:1
				},{
					name:'Gate Panel (Standard)',
					value:1
				}],
				large:[{
					name:'Steel Gate Post',
					value:1
				},{
					name:'Gate Hardware',
					value:1
				},{
					name:'Gate Panel (Large)',
					value:1
				}]
			}
		}
	];

	return factory;
});