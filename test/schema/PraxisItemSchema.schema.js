const itemSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer'
    },
    name: {
      type: 'string'
    },
    sellIn: {
      type: 'integer'
    },
    quality: {
      type: 'integer'
    },
    type: {
      type: 'string',
      enum: ['AGED', 'NORMAL', 'TICKET', 'LEGENDARY']
    }
  }
};

exports.itemSchema = itemSchema;
