module.exports = {
  activations: ['relu', 'softmax', 'tanh', 'sigmoid'],
  optimizers: ['adam', 'sgd', 'momentum', 'adagrad', 'adadelta', 'adamax', 'rmsprop'],
  loss: [
    'categoricalCrossentropy',
    'absoluteDifference',
    'computeWeightedLoss',
    'cosineDistance',
    'hingeLoss',
    'huberLoss',
    'logLoss',
    'meanSquaredError',
    'sigmoidCrossEntropy',
    'softmaxCrossEntropy',
  ],
  metrics: [
    'accuracy',
    'binaryAccuracy',
    'binaryCrossentropy',
    'categoricalAccuracy',
    'categoricalCrossentropy ',
    'cosineProximity',
    'meanAbsoluteError',
    'meanAbsolutePercentageError',
    'meanSquaredError',
    'precision',
    'recall',
    'sparseCategoricalAccuracy',
  ],

  sheetsNames: {
    inclinometry: 'inclinometry',
    lithology: 'lithology',
    wellhead: 'wellhead',
  },

  intervalIncline: {
    Straight: 'straight',
    FromMinToMax: 'FromMinToMax',
    FromMaxToMin: 'FromMaxToMin',
  },
};
