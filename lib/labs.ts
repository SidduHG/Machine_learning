export const labs = [
  {
    id: 'linear-regression',
    title: 'Linear regression',
    category: 'FIT A PATTERN',
    description:
      'Move the line. See every residual. Find the fit with the smallest mean squared error.',
    prompt:
      'Raise the slope, then use Fit least squares. Why does the chosen line balance the residuals?',
    lesson: 'linear-regression',
    formula: 'ŷ = wx + b · J = mean((ŷ − y)²)',
  },
  {
    id: 'gradient-descent',
    title: 'Gradient descent',
    category: 'WATCH LEARNING HAPPEN',
    description:
      'A point on this loss surface is a complete model. Take a step and watch its error change.',
    prompt:
      'Try η = 0.1, then η = 0.6. When does the path stop descending? Reset before comparing.',
    lesson: 'gradient-descent',
    formula: 'θnext = θ − η ∇J(θ)',
  },
  {
    id: 'logistic-regression',
    title: 'Logistic regression',
    category: 'DRAW A BOUNDARY',
    description:
      'Change a linear score and see probabilities become classification decisions.',
    prompt:
      'Raise the decision threshold. What happens to the number of positive predictions and recall?',
    lesson: 'logistic-regression',
    formula: 'p = sigmoid(wx₁ + x₂ + b)',
  },
  {
    id: 'knn',
    title: 'Nearest neighbors',
    category: 'LEARN BY COMPARISON',
    description:
      'Move a query through the data and let its nearest neighbors vote.',
    prompt:
      'Compare k = 1 with k = 15 near the boundary. Which prediction changes more abruptly?',
    lesson: 'knn',
    formula: 'prediction = majority label among k closest points',
  },
  {
    id: 'decision-tree',
    title: 'Decision tree',
    category: 'ASK A BETTER QUESTION',
    description:
      'Slide a split through the data. Compare the impurity before and after the question.',
    prompt:
      'Find a threshold with high Gini gain. Why is a split that leaves an empty side unhelpful?',
    lesson: 'decision-trees',
    formula: 'gain = Gparent − (nL GL + nR GR) / n',
  },
  {
    id: 'k-means',
    title: 'K-means clustering',
    category: 'DISCOVER STRUCTURE',
    description:
      'Color each point by its nearest center, then move the centers to their assigned means.',
    prompt:
      'Step until the centers stop moving. Try more clusters: why does lower inertia not prove a better grouping?',
    lesson: 'k-means',
    formula: 'J = Σᵢ ‖xᵢ − μcluster(i)‖²',
  },
  {
    id: 'pca',
    title: 'Principal components',
    category: 'CHANGE YOUR VIEWPOINT',
    description:
      'Rotate a projection direction and measure the information lost when you flatten the data.',
    prompt:
      'Find the angle with the smallest reconstruction error. Compare it with the first principal component.',
    lesson: 'pca',
    formula: 'projection = μ + ((x − μ) · u) u',
  },
  {
    id: 'neural-network',
    title: 'A neural network',
    category: 'FOLLOW THE SIGNAL',
    description:
      'Send two inputs through three ReLU units and a sigmoid output. Every number is computed live.',
    prompt:
      'Make a hidden preactivation negative. Why does that unit stop passing a signal? This is a fixed-weight forward pass, not training.',
    lesson: 'neural-networks',
    formula: 'h = ReLU(Wx + b) · p = sigmoid([1, 1, −0.7] · h − 0.5)',
  },
  {
    id: 'attention',
    title: 'Self-attention',
    category: 'LEARN WHAT TO LOOK AT',
    description:
      'Choose a query token and inspect how its similarity to every key controls the information mix.',
    prompt:
      'Lower temperature, then enable the causal mask. Which weights become exactly zero? These are illustrative fixed vectors, not a pretrained language model.',
    lesson: 'attention',
    formula: 'weights = softmax(QKᵀ / (√d · temperature) + mask)',
  },
] as const;
export type LabId = (typeof labs)[number]['id'];
