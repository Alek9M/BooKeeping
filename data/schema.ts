import {appSchema, ColumnSchema, tableSchema} from '@nozbe/watermelondb';

const entryColumns: ColumnSchema[] = [
  {name: 'title', type: 'string'},
  {name: 'date', type: 'string', isIndexed: true},
  {name: 'day', type: 'number'},
  {name: 'month', type: 'number'},
  {name: 'year', type: 'number'},
  {name: 'uuid', type: 'string'},
  {name: 'is_done', type: 'boolean', isIndexed: true},
  {name: 'done_at', type: 'string', isOptional: true},
  {name: 'previous', type: 'string', isOptional: true, isIndexed: true},
  {name: 'next', type: 'string', isOptional: true, isIndexed: true},
];

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'notes',
      columns: [
        ...entryColumns,
        { name: 'note', type: 'string' },
        {
          name: 'contact_id',
          type: 'string',
          isOptional: true,
        },
        {name: 'project_id', type: 'string', isOptional: true, isIndexed: true},
      ],
    }),
    tableSchema({
      name: 'noteListItems',
      columns: [
        { name: 'item', type: 'string' },
        { name: 'is_done', type: 'boolean' },
        {name: 'uuid', type: 'string'},
        { name: 'item_id', type: 'string', isOptional: false, isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'payments',
      columns: [
        ...entryColumns,
        {name: 'type', type: 'number'},
        // {name: 'contact', type: 'string'},
        {name: 'amount', type: 'number'},
        {name: 'project_id', type: 'string', isIndexed: true},
        {name: 'sale_id', type: 'string', isOptional: true},
        // {name: 'purchase_id', type: 'string', isOptional: true},
        {
          name: 'budgetTag_id',
          type: 'string',
          isOptional: true,
          isIndexed: true,
        },
        {
          name: 'contact_id',
          type: 'string',
          isOptional: true,
          isIndexed: true,
        },
      ],
    }),
    tableSchema({
      name: 'budgetTags',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'month', type: 'number', isIndexed: true},
        {name: 'year', type: 'number', isIndexed: true},
        {name: 'type', type: 'number', isIndexed: true},
        {name: 'amount', type: 'number'},
        {name: 'uuid', type: 'string'},
        {name: 'project_id', type: 'string', isIndexed: true},
      ],
    }),
    tableSchema({
      name: 'projects',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'type', type: 'number'},
        {name: 'color', type: 'string'},
        {name: 'terminated', type: 'boolean'},
        {name: 'uuid', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'services',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'uuid', type: 'string'},
        {name: 'project_id', type: 'string', isIndexed: true},
      ],
    }),
    tableSchema({
      name: 'contacts',
      columns: [
        {name: 'record_id', type: 'string'},
        {name: 'family_name', type: 'string'},
        {name: 'given_name', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'contact_sale',
      columns: [
        {name: 'contact_id', type: 'string'},
        {name: 'sale_id', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'servicePrices',
      columns: [
        {name: 'price', type: 'number'},
        {name: 'uuid', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'service_id', type: 'string', isIndexed: true},
      ],
    }),
    tableSchema({
      name: 'purchases',
      columns: [
        ...entryColumns,
        // {name: 'delayedDate', type: 'string', isOptional: true},
        // {name: 'contact', type: 'string'},
        {name: 'amount', type: 'number'},
        {name: 'project_id', type: 'string', isIndexed: true},
        {name: 'payment_id', type: 'string', isOptional: true},
        {
          name: 'budgetTag_id',
          type: 'string',
          isOptional: true,
          isIndexed: true,
        },
        {
          name: 'contact_id',
          type: 'string',
          isOptional: true,
          isIndexed: true,
        },
      ],
    }),
    tableSchema({
      name: 'articles',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'uuid', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'articleIns',
      columns: [
        {name: 'quantity', type: 'number'},
        {name: 'priceIn', type: 'number'},
        {name: 'suggestedPriceOut', type: 'number'},
        {name: 'uuid', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'article_id', type: 'string', isIndexed: true},
        {name: 'purchase_id', type: 'string', isOptional: true},
      ],
    }),
    tableSchema({
      name: 'serviceExecutions',
      columns: [
        {name: 'quantity', type: 'number'},
        {name: 'discount', type: 'number'},
        {name: 'contact', type: 'string'},
        {name: 'everyone', type: 'boolean'},
        {name: 'split', type: 'boolean'},
        {name: 'uuid', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'sale_id', type: 'string', isOptional: false},
        {name: 'servicePrice_id', type: 'string', isOptional: false},
      ],
    }),
    tableSchema({
      name: 'articleOuts',
      columns: [
        {name: 'quantity', type: 'number'},
        {name: 'priceOut', type: 'number'},
        {name: 'discount', type: 'number'},
        {name: 'contact', type: 'string'},
        {name: 'everyone', type: 'boolean'},
        {name: 'split', type: 'boolean'},
        {name: 'uuid', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'sale_id', type: 'string', isOptional: true},
        {name: 'articleIn_id', type: 'string', isOptional: true},
        {name: 'article_id', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'sales',
      columns: [
        ...entryColumns,
        // {name: 'delayedDate', type: 'string', isOptional: true},
        // {name: 'contact', type: 'string'},
        {name: 'amount', type: 'number'},
        {name: 'project_id', type: 'string', isIndexed: true},
        // {name: 'payment_id', type: 'string', isOptional: true},
        {
          name: 'budgetTag_id',
          type: 'string',
          isOptional: true,
          isIndexed: true,
        },
      ],
    }),
    tableSchema({
      name: 'contact_cards',
      columns: [
        {name: 'bank', type: 'string', isIndexed: true},
        {name: 'name', type: 'string', isIndexed: true},
        {name: 'number', type: 'string', isIndexed: true},
        {
          name: 'contact_id',
          type: 'string',
          isOptional: true,
          isIndexed: true,
        },
      ],
    }),
  ],
});
