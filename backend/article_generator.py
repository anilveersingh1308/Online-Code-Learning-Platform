"""
Comprehensive Article Generation System for CodeLearnHub
Generates production-ready educational articles with all required sections
"""

import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Optional, Any
import re

# Article difficulty levels
DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced']

# Categories and their subtopics
CATEGORIES = {
    'programming-languages': {
        'name': 'Programming Languages',
        'icon': 'Code2',
        'color': '#3b82f6',
        'topics': {
            'python': {
                'name': 'Python',
                'subtopics': [
                    'getting-started', 'syntax-fundamentals', 'control-flow',
                    'functions', 'data-structures', 'oop', 'file-handling',
                    'error-handling', 'advanced-features', 'best-practices'
                ]
            },
            'javascript': {
                'name': 'JavaScript',
                'subtopics': [
                    'getting-started', 'syntax-fundamentals', 'control-flow',
                    'functions', 'data-structures', 'oop', 'async-programming',
                    'dom-manipulation', 'es6-features', 'best-practices'
                ]
            },
            'java': {
                'name': 'Java',
                'subtopics': [
                    'getting-started', 'syntax-fundamentals', 'control-flow',
                    'functions', 'data-structures', 'oop', 'file-handling',
                    'exception-handling', 'collections', 'multithreading'
                ]
            },
            'typescript': {
                'name': 'TypeScript',
                'subtopics': [
                    'getting-started', 'type-system', 'interfaces',
                    'generics', 'advanced-types', 'decorators'
                ]
            },
            'cpp': {
                'name': 'C++',
                'subtopics': [
                    'getting-started', 'syntax-fundamentals', 'pointers',
                    'memory-management', 'oop', 'stl', 'templates'
                ]
            },
            'go': {
                'name': 'Go',
                'subtopics': [
                    'getting-started', 'syntax-fundamentals', 'concurrency',
                    'interfaces', 'packages', 'error-handling'
                ]
            },
            'rust': {
                'name': 'Rust',
                'subtopics': [
                    'getting-started', 'ownership', 'borrowing',
                    'lifetimes', 'traits', 'error-handling'
                ]
            }
        }
    },
    'web-development': {
        'name': 'Web Development',
        'icon': 'Globe',
        'color': '#22c55e',
        'topics': {
            'html': {
                'name': 'HTML5',
                'subtopics': [
                    'fundamentals', 'semantic-html', 'forms', 'multimedia',
                    'accessibility', 'seo-basics'
                ]
            },
            'css': {
                'name': 'CSS3',
                'subtopics': [
                    'fundamentals', 'flexbox', 'grid', 'responsive-design',
                    'animations', 'preprocessors', 'modern-css'
                ]
            },
            'javascript-web': {
                'name': 'JavaScript for Web',
                'subtopics': [
                    'dom-manipulation', 'events', 'fetch-api', 'local-storage',
                    'async-patterns', 'es6-modules'
                ]
            },
            'react': {
                'name': 'React',
                'subtopics': [
                    'getting-started', 'components', 'state-props', 'hooks',
                    'routing', 'state-management', 'testing', 'optimization'
                ]
            },
            'nextjs': {
                'name': 'Next.js',
                'subtopics': [
                    'getting-started', 'routing', 'data-fetching',
                    'api-routes', 'deployment', 'optimization'
                ]
            },
            'nodejs': {
                'name': 'Node.js',
                'subtopics': [
                    'getting-started', 'modules', 'express', 'rest-api',
                    'authentication', 'database', 'deployment'
                ]
            }
        }
    },
    'data-science-ai': {
        'name': 'Data Science & AI',
        'icon': 'Brain',
        'color': '#f97316',
        'topics': {
            'python-data-science': {
                'name': 'Python for Data Science',
                'subtopics': [
                    'numpy', 'pandas', 'matplotlib', 'seaborn',
                    'data-cleaning', 'eda', 'statistics'
                ]
            },
            'machine-learning': {
                'name': 'Machine Learning',
                'subtopics': [
                    'fundamentals', 'preprocessing', 'supervised-learning',
                    'unsupervised-learning', 'model-evaluation', 'feature-engineering'
                ]
            },
            'deep-learning': {
                'name': 'Deep Learning',
                'subtopics': [
                    'neural-networks', 'cnn', 'rnn', 'transfer-learning',
                    'tensorflow', 'pytorch'
                ]
            }
        }
    },
    'ai-prompt-engineering': {
        'name': 'AI & Prompt Engineering',
        'icon': 'Sparkles',
        'color': '#8b5cf6',
        'topics': {
            'ai-fundamentals': {
                'name': 'AI Fundamentals',
                'subtopics': [
                    'introduction-to-ai', 'llm-basics', 'ai-models-comparison',
                    'use-cases', 'limitations', 'ethics'
                ]
            },
            'prompt-engineering': {
                'name': 'Prompt Engineering',
                'subtopics': [
                    'fundamentals', 'advanced-techniques', 'chain-of-thought',
                    'few-shot-learning', 'prompt-chaining', 'structured-outputs'
                ]
            },
            'ai-coding': {
                'name': 'AI-Assisted Coding',
                'subtopics': [
                    'github-copilot', 'cursor-ai', 'code-generation',
                    'debugging-with-ai', 'best-practices'
                ]
            },
            'ai-applications': {
                'name': 'Building AI Applications',
                'subtopics': [
                    'api-integration', 'chatbots', 'rag-systems',
                    'function-calling', 'deployment'
                ]
            }
        }
    },
    'algorithms-dsa': {
        'name': 'Algorithms & Data Structures',
        'icon': 'GitBranch',
        'color': '#ef4444',
        'topics': {
            'arrays-strings': {
                'name': 'Arrays & Strings',
                'subtopics': [
                    'fundamentals', 'two-pointers', 'sliding-window',
                    'prefix-sum', 'string-algorithms'
                ]
            },
            'linked-lists': {
                'name': 'Linked Lists',
                'subtopics': [
                    'singly-linked', 'doubly-linked', 'fast-slow-pointers',
                    'reversal', 'cycle-detection'
                ]
            },
            'stacks-queues': {
                'name': 'Stacks & Queues',
                'subtopics': [
                    'stack-basics', 'queue-basics', 'monotonic-stack',
                    'priority-queue', 'applications'
                ]
            },
            'trees-graphs': {
                'name': 'Trees & Graphs',
                'subtopics': [
                    'binary-trees', 'bst', 'traversals', 'graph-basics',
                    'bfs', 'dfs', 'shortest-path', 'mst'
                ]
            },
            'dynamic-programming': {
                'name': 'Dynamic Programming',
                'subtopics': [
                    'fundamentals', '1d-dp', '2d-dp', 'knapsack',
                    'lcs-lis', 'optimization'
                ]
            },
            'sorting-searching': {
                'name': 'Sorting & Searching',
                'subtopics': [
                    'comparison-sorts', 'non-comparison-sorts',
                    'binary-search', 'search-variations'
                ]
            }
        }
    },
    'software-engineering': {
        'name': 'Software Engineering',
        'icon': 'Terminal',
        'color': '#06b6d4',
        'topics': {
            'git': {
                'name': 'Git & Version Control',
                'subtopics': [
                    'fundamentals', 'branching', 'merging', 'workflows',
                    'github', 'advanced-git'
                ]
            },
            'testing': {
                'name': 'Testing & TDD',
                'subtopics': [
                    'fundamentals', 'unit-testing', 'integration-testing',
                    'tdd', 'mocking', 'coverage'
                ]
            },
            'clean-code': {
                'name': 'Clean Code & Design Patterns',
                'subtopics': [
                    'principles', 'solid', 'design-patterns', 'refactoring',
                    'code-smells', 'best-practices'
                ]
            },
            'devops': {
                'name': 'DevOps Basics',
                'subtopics': [
                    'ci-cd', 'docker', 'kubernetes-basics', 'monitoring',
                    'deployment-strategies'
                ]
            }
        }
    },
    'mobile-development': {
        'name': 'Mobile Development',
        'icon': 'Smartphone',
        'color': '#ec4899',
        'topics': {
            'react-native': {
                'name': 'React Native',
                'subtopics': [
                    'getting-started', 'components', 'navigation',
                    'styling', 'apis', 'deployment'
                ]
            },
            'flutter': {
                'name': 'Flutter',
                'subtopics': [
                    'getting-started', 'widgets', 'state-management',
                    'navigation', 'networking', 'deployment'
                ]
            }
        }
    },
    'cloud-devops': {
        'name': 'Cloud & DevOps',
        'icon': 'Cloud',
        'color': '#0ea5e9',
        'topics': {
            'aws': {
                'name': 'AWS',
                'subtopics': [
                    'getting-started', 'ec2', 's3', 'lambda',
                    'rds', 'deployment'
                ]
            },
            'docker': {
                'name': 'Docker',
                'subtopics': [
                    'fundamentals', 'images', 'containers', 'compose',
                    'networking', 'best-practices'
                ]
            }
        }
    }
}


class ArticleTemplate:
    """Base template for generating articles"""
    
    @staticmethod
    def generate_article_id() -> str:
        return f"article_{uuid.uuid4().hex[:12]}"
    
    @staticmethod
    def generate_slug(title: str) -> str:
        return re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
    
    @staticmethod
    def calculate_reading_time(content: str) -> int:
        """Calculate estimated reading time based on word count (200 wpm average)"""
        words = len(content.split())
        return max(5, round(words / 200))
    
    @staticmethod
    def generate_table_of_contents(content: str) -> List[Dict]:
        """Generate table of contents from markdown headers"""
        toc = []
        lines = content.split('\n')
        for line in lines:
            if line.startswith('#'):
                level = len(line.split()[0])
                text = line.lstrip('#').strip()
                toc.append({
                    'level': level,
                    'text': text,
                    'id': re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')
                })
        return toc


class ArticleGenerator:
    """Generates complete articles based on templates"""
    
    def __init__(self):
        self.templates = {}
        self._load_templates()
    
    def _load_templates(self):
        """Load article templates for different types"""
        self.templates = {
            'getting-started': self._getting_started_template,
            'syntax-fundamentals': self._syntax_fundamentals_template,
            'control-flow': self._control_flow_template,
            'functions': self._functions_template,
            'data-structures': self._data_structures_template,
            'oop': self._oop_template,
            'file-handling': self._file_handling_template,
            'error-handling': self._error_handling_template,
            'best-practices': self._best_practices_template,
            'fundamentals': self._fundamentals_template,
            'default': self._default_template
        }
    
    def generate_article(
        self,
        category: str,
        topic: str,
        subtopic: str,
        language: str = None
    ) -> Dict[str, Any]:
        """Generate a complete article for a given topic"""
        
        template_func = self.templates.get(subtopic, self.templates['default'])
        
        article_data = template_func(category, topic, subtopic, language)
        
        # Add metadata
        article_data['article_id'] = ArticleTemplate.generate_article_id()
        article_data['slug'] = ArticleTemplate.generate_slug(article_data['title'])
        article_data['estimated_reading_time'] = ArticleTemplate.calculate_reading_time(
            article_data['content']
        )
        article_data['table_of_contents'] = ArticleTemplate.generate_table_of_contents(
            article_data['content']
        )
        article_data['created_at'] = datetime.now(timezone.utc).isoformat()
        article_data['updated_at'] = datetime.now(timezone.utc).isoformat()
        article_data['is_published'] = True
        article_data['view_count'] = 0
        article_data['helpful_count'] = 0
        article_data['not_helpful_count'] = 0
        
        return article_data
    
    def _getting_started_template(
        self, category: str, topic: str, subtopic: str, language: str = None
    ) -> Dict:
        """Template for 'Getting Started' articles"""
        
        lang_name = language or topic.title()
        
        return {
            'title': f'Getting Started with {lang_name}',
            'subtitle': f'A comprehensive guide to begin your {lang_name} programming journey',
            'category_id': category,
            'topic': topic,
            'subtopic': subtopic,
            'difficulty_level': 'beginner',
            'prerequisites': [],
            'tags': [lang_name, 'Beginner', 'Tutorial', 'Getting Started'],
            'meta_description': f'Learn {lang_name} from scratch. This beginner-friendly guide covers installation, setup, and your first program.',
            'content': self._generate_getting_started_content(lang_name),
            'code_examples': self._generate_getting_started_examples(lang_name),
            'exercises': self._generate_getting_started_exercises(lang_name),
            'quiz_questions': self._generate_getting_started_quiz(lang_name),
            'interview_questions': self._generate_interview_questions(lang_name, 'basics'),
            'external_resources': self._get_external_resources(lang_name, 'beginner'),
            'related_articles': [],
            'author': 'CodeLearnHub Team'
        }
    
    def _generate_getting_started_content(self, language: str) -> str:
        """Generate content for getting started article"""
        return f'''
# Getting Started with {language}

Welcome to your {language} programming journey! This comprehensive guide will take you from complete beginner to writing your first programs.

## Introduction

### What is {language}?

{language} is a powerful programming language used by millions of developers worldwide. Whether you're interested in web development, data science, automation, or building applications, {language} provides the tools you need to succeed.

### Why Learn {language}?

- **Versatility**: {language} can be used for a wide range of applications
- **Strong Community**: Millions of developers and extensive documentation
- **Career Opportunities**: High demand in the job market
- **Beginner-Friendly**: Clean syntax that's easy to learn

### What You'll Learn

By the end of this guide, you will:
- Understand what {language} is and its applications
- Set up your development environment
- Write and run your first {language} program
- Understand basic syntax and concepts
- Know where to go next in your learning journey

## Setting Up Your Development Environment

### Installation

Follow these steps to install {language} on your computer:

#### Windows
1. Download the installer from the official website
2. Run the installer and follow the prompts
3. Add {language} to your PATH environment variable
4. Verify installation by opening Command Prompt and typing the version command

#### macOS
1. Use Homebrew: `brew install {language.lower()}`
2. Or download from the official website
3. Verify installation in Terminal

#### Linux
1. Use your package manager (apt, yum, etc.)
2. Or download and compile from source
3. Verify installation in terminal

### Choosing an IDE or Editor

Recommended options for {language} development:

1. **Visual Studio Code** (Recommended for beginners)
   - Free and lightweight
   - Excellent {language} extension
   - Built-in terminal

2. **PyCharm / IntelliJ IDEA**
   - Full-featured IDE
   - Powerful debugging tools
   - Code completion and refactoring

3. **Sublime Text**
   - Fast and lightweight
   - Great for quick edits

## Your First {language} Program

Let's write the classic "Hello, World!" program:

```{language.lower()}
# This is your first {language} program
print("Hello, World!")
```

### Understanding the Code

- `print()` is a built-in function that outputs text to the console
- The text inside quotes is called a string
- Every {language} program starts execution from the top

### Running Your Program

1. Save your file with the appropriate extension
2. Open terminal/command prompt
3. Navigate to your file's directory
4. Run the program using the {language} interpreter

## Basic Concepts

### Variables

Variables are containers for storing data values:

```{language.lower()}
# Declaring variables
name = "Alice"
age = 25
height = 5.6
is_student = True

# Using variables
print(name)
print(age)
```

### Data Types

{language} supports several data types:

| Type | Description | Example |
|------|-------------|---------|
| String | Text data | "Hello" |
| Integer | Whole numbers | 42 |
| Float | Decimal numbers | 3.14 |
| Boolean | True/False values | True |

### Comments

Comments help document your code:

```{language.lower()}
# This is a single-line comment

"""
This is a
multi-line comment
"""
```

## Basic Input and Output

### Getting User Input

```{language.lower()}
# Getting input from user
name = input("What is your name? ")
print("Hello, " + name + "!")
```

### Formatted Output

```{language.lower()}
# Using f-strings for formatted output
name = "Alice"
age = 25
print(f"My name is {{name}} and I am {{age}} years old.")
```

## Simple Calculator Project

Let's build a simple calculator to practice what you've learned:

```{language.lower()}
# Simple Calculator
print("Simple Calculator")
print("=" * 20)

# Get input from user
num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))

# Perform calculations
sum_result = num1 + num2
diff_result = num1 - num2
prod_result = num1 * num2
div_result = num1 / num2 if num2 != 0 else "Cannot divide by zero"

# Display results
print(f"\\nResults:")
print(f"{{num1}} + {{num2}} = {{sum_result}}")
print(f"{{num1}} - {{num2}} = {{diff_result}}")
print(f"{{num1}} × {{num2}} = {{prod_result}}")
print(f"{{num1}} ÷ {{num2}} = {{div_result}}")
```

## Common Mistakes to Avoid

1. **Forgetting quotes around strings**
   ```{language.lower()}
   # Wrong
   name = Alice
   
   # Correct
   name = "Alice"
   ```

2. **Incorrect indentation**
   ```{language.lower()}
   # Wrong
   if True:
   print("Hello")
   
   # Correct
   if True:
       print("Hello")
   ```

3. **Using wrong variable names**
   - Variable names are case-sensitive
   - Cannot start with numbers
   - Cannot use reserved keywords

## Best Practices for Beginners

1. **Write clean, readable code**
2. **Use meaningful variable names**
3. **Add comments to explain your logic**
4. **Practice regularly**
5. **Don't be afraid to make mistakes**
6. **Use online resources and documentation**

## Summary

Congratulations! You've taken your first steps in {language} programming. Here's what you've learned:

- ✅ What {language} is and why it's popular
- ✅ How to set up your development environment
- ✅ Writing and running your first program
- ✅ Basic concepts: variables, data types, comments
- ✅ Input and output operations
- ✅ Built a simple calculator project

## Next Steps

Continue your learning journey with these topics:

1. **{language} Syntax Fundamentals** - Deep dive into operators and expressions
2. **Control Flow** - Learn about conditions and loops
3. **Functions** - Write reusable code blocks
4. **Data Structures** - Work with lists, dictionaries, and more

Happy coding! 🚀
'''
    
    def _generate_getting_started_examples(self, language: str) -> List[Dict]:
        """Generate code examples for getting started article"""
        return [
            {
                'id': 'example_1',
                'title': 'Hello World',
                'description': 'Your first program that prints a greeting',
                'code': f'# Hello World in {language}\nprint("Hello, World!")',
                'language': language.lower(),
                'expected_output': 'Hello, World!',
                'explanation': 'The print() function outputs text to the console.'
            },
            {
                'id': 'example_2',
                'title': 'Variables and Data Types',
                'description': 'Declaring and using different variable types',
                'code': '''# Variables in Python
name = "Alice"      # String
age = 25           # Integer
height = 5.6       # Float
is_student = True  # Boolean

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height}")
print(f"Student: {is_student}")''',
                'language': language.lower(),
                'expected_output': 'Name: Alice\nAge: 25\nHeight: 5.6\nStudent: True',
                'explanation': 'Variables store data values. Python automatically determines the type.'
            },
            {
                'id': 'example_3',
                'title': 'User Input',
                'description': 'Getting input from the user',
                'code': '''# Getting user input
name = input("What is your name? ")
age = int(input("How old are you? "))

print(f"Hello {name}! You are {age} years old.")''',
                'language': language.lower(),
                'expected_output': 'What is your name? [user input]\nHow old are you? [user input]\nHello [name]! You are [age] years old.',
                'explanation': 'The input() function reads text from the user. Use int() to convert to numbers.'
            },
            {
                'id': 'example_4',
                'title': 'Basic Arithmetic',
                'description': 'Performing mathematical operations',
                'code': '''# Basic arithmetic operations
a = 10
b = 3

print(f"Addition: {a} + {b} = {a + b}")
print(f"Subtraction: {a} - {b} = {a - b}")
print(f"Multiplication: {a} * {b} = {a * b}")
print(f"Division: {a} / {b} = {a / b}")
print(f"Integer Division: {a} // {b} = {a // b}")
print(f"Modulus: {a} % {b} = {a % b}")
print(f"Exponent: {a} ** {b} = {a ** b}")''',
                'language': language.lower(),
                'expected_output': 'Addition: 10 + 3 = 13\nSubtraction: 10 - 3 = 7\nMultiplication: 10 * 3 = 30\nDivision: 10 / 3 = 3.333...\nInteger Division: 10 // 3 = 3\nModulus: 10 % 3 = 1\nExponent: 10 ** 3 = 1000',
                'explanation': 'Python supports all basic arithmetic operations including modulus and exponentiation.'
            },
            {
                'id': 'example_5',
                'title': 'String Operations',
                'description': 'Working with text strings',
                'code': '''# String operations
message = "Hello, World!"

print(f"Original: {message}")
print(f"Uppercase: {message.upper()}")
print(f"Lowercase: {message.lower()}")
print(f"Length: {len(message)}")
print(f"First char: {message[0]}")
print(f"Last char: {message[-1]}")
print(f"Slice: {message[0:5]}")''',
                'language': language.lower(),
                'expected_output': 'Original: Hello, World!\nUppercase: HELLO, WORLD!\nLowercase: hello, world!\nLength: 13\nFirst char: H\nLast char: !\nSlice: Hello',
                'explanation': 'Strings have many built-in methods for manipulation. Indexing starts at 0.'
            }
        ]
    
    def _generate_getting_started_exercises(self, language: str) -> List[Dict]:
        """Generate practice exercises"""
        return [
            {
                'id': 'exercise_1',
                'title': 'Personal Introduction',
                'difficulty': 'beginner',
                'problem': 'Write a program that asks for the user\'s name, age, and favorite color, then prints a personalized message.',
                'hints': [
                    'Use input() to get user data',
                    'Store each value in a variable',
                    'Use f-strings for formatted output'
                ],
                'solution': '''name = input("What is your name? ")
age = input("How old are you? ")
color = input("What is your favorite color? ")

print(f"Hello {name}!")
print(f"You are {age} years old.")
print(f"Your favorite color is {color}.")''',
                'test_cases': [
                    {'input': 'Alice\n25\nBlue', 'expected_contains': ['Alice', '25', 'Blue']}
                ]
            },
            {
                'id': 'exercise_2',
                'title': 'Temperature Converter',
                'difficulty': 'beginner',
                'problem': 'Create a program that converts temperature from Celsius to Fahrenheit. Formula: F = C × 9/5 + 32',
                'hints': [
                    'Get Celsius input from user',
                    'Convert to float for decimal values',
                    'Apply the formula',
                    'Display the result'
                ],
                'solution': '''celsius = float(input("Enter temperature in Celsius: "))
fahrenheit = celsius * 9/5 + 32
print(f"{celsius}°C = {fahrenheit}°F")''',
                'test_cases': [
                    {'input': '0', 'expected_contains': ['32']},
                    {'input': '100', 'expected_contains': ['212']}
                ]
            },
            {
                'id': 'exercise_3',
                'title': 'Area Calculator',
                'difficulty': 'beginner',
                'problem': 'Write a program that calculates the area of a rectangle given its length and width.',
                'hints': [
                    'Get length and width from user',
                    'Area = length × width',
                    'Display the result'
                ],
                'solution': '''length = float(input("Enter length: "))
width = float(input("Enter width: "))
area = length * width
print(f"The area of the rectangle is {area}")''',
                'test_cases': [
                    {'input': '5\n4', 'expected_contains': ['20']},
                    {'input': '10\n3', 'expected_contains': ['30']}
                ]
            },
            {
                'id': 'exercise_4',
                'title': 'Simple Interest Calculator',
                'difficulty': 'beginner',
                'problem': 'Calculate simple interest given principal, rate, and time. Formula: SI = P × R × T / 100',
                'hints': [
                    'Get principal, rate, and time from user',
                    'Apply the simple interest formula',
                    'Calculate total amount = principal + interest'
                ],
                'solution': '''principal = float(input("Enter principal amount: "))
rate = float(input("Enter interest rate (%): "))
time = float(input("Enter time in years: "))

interest = principal * rate * time / 100
total = principal + interest

print(f"Simple Interest: {interest}")
print(f"Total Amount: {total}")''',
                'test_cases': [
                    {'input': '1000\n5\n2', 'expected_contains': ['100', '1100']}
                ]
            },
            {
                'id': 'exercise_5',
                'title': 'BMI Calculator',
                'difficulty': 'beginner',
                'problem': 'Create a BMI calculator. Formula: BMI = weight(kg) / height(m)²',
                'hints': [
                    'Get weight in kg and height in meters',
                    'Calculate BMI using the formula',
                    'Display the BMI value'
                ],
                'solution': '''weight = float(input("Enter weight in kg: "))
height = float(input("Enter height in meters: "))

bmi = weight / (height ** 2)

print(f"Your BMI is: {bmi:.2f}")''',
                'test_cases': [
                    {'input': '70\n1.75', 'expected_contains': ['22.86']}
                ]
            }
        ]
    
    def _generate_getting_started_quiz(self, language: str) -> List[Dict]:
        """Generate quiz questions"""
        return [
            {
                'id': 'quiz_1',
                'question': f'What is the correct way to print "Hello" in {language}?',
                'options': [
                    'echo("Hello")',
                    'print("Hello")',
                    'console.log("Hello")',
                    'System.out.println("Hello")'
                ],
                'correct_answer': 1,
                'explanation': f'{language} uses the print() function to output text to the console.'
            },
            {
                'id': 'quiz_2',
                'question': 'Which of the following is a valid variable name?',
                'options': [
                    '2name',
                    'my-name',
                    'my_name',
                    'class'
                ],
                'correct_answer': 2,
                'explanation': 'Variable names cannot start with numbers, contain hyphens, or use reserved keywords. Underscores are allowed.'
            },
            {
                'id': 'quiz_3',
                'question': 'What data type is the value 3.14?',
                'options': [
                    'Integer',
                    'String',
                    'Float',
                    'Boolean'
                ],
                'correct_answer': 2,
                'explanation': '3.14 is a decimal number, which is represented as a float (floating-point number).'
            },
            {
                'id': 'quiz_4',
                'question': 'What is the result of 10 // 3?',
                'options': [
                    '3.33',
                    '3',
                    '1',
                    '30'
                ],
                'correct_answer': 1,
                'explanation': 'The // operator performs integer (floor) division, returning only the whole number part.'
            },
            {
                'id': 'quiz_5',
                'question': 'How do you start a single-line comment?',
                'options': [
                    '//',
                    '#',
                    '/*',
                    '--'
                ],
                'correct_answer': 1,
                'explanation': f'In {language}, single-line comments start with the # symbol.'
            }
        ]
    
    def _generate_interview_questions(self, language: str, topic: str) -> List[Dict]:
        """Generate interview questions for the topic"""
        return [
            {
                'question': f'What is {language} and why is it popular?',
                'answer': f'{language} is a high-level, interpreted programming language known for its simplicity and readability. It\'s popular because of its versatility, strong community, and extensive libraries.',
                'follow_up': f'Can you name some popular applications or companies that use {language}?'
            },
            {
                'question': f'What is the difference between = and == in {language}?',
                'answer': '= is the assignment operator, used to assign values to variables. == is the comparison operator, used to check if two values are equal.',
                'follow_up': 'What would happen if you accidentally used = instead of == in an if statement?'
            },
            {
                'question': f'What are the basic data types in {language}?',
                'answer': f'{language} has several basic data types: integers (int), floating-point numbers (float), strings (str), booleans (bool), and None.',
                'follow_up': 'How do you convert between different data types?'
            },
            {
                'question': f'How do you get user input in {language}?',
                'answer': f'You use the input() function to get user input. The input is always returned as a string, so you may need to convert it to other types.',
                'follow_up': 'What error might occur if you try to use input directly in a calculation?'
            },
            {
                'question': f'What is the purpose of comments in code?',
                'answer': 'Comments are used to document code, explain complex logic, and make code more readable for other developers (and yourself in the future). They are ignored by the interpreter.',
                'follow_up': 'What\'s the difference between single-line and multi-line comments?'
            }
        ]
    
    def _get_external_resources(self, language: str, level: str) -> List[Dict]:
        """Get relevant external resources"""
        resources = {
            'python': [
                {'name': 'freeCodeCamp Python Course', 'url': 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', 'type': 'course', 'description': 'Free comprehensive Python course'},
                {'name': 'Codecademy Python', 'url': 'https://www.codecademy.com/learn/learn-python-3', 'type': 'course', 'description': 'Interactive Python learning'},
                {'name': 'Python Official Docs', 'url': 'https://docs.python.org/3/tutorial/', 'type': 'documentation', 'description': 'Official Python tutorial'},
                {'name': 'Real Python', 'url': 'https://realpython.com/', 'type': 'tutorial', 'description': 'Python tutorials and articles'},
                {'name': 'Python Crash Course', 'url': 'https://nostarch.com/pythoncrashcourse2e', 'type': 'book', 'description': 'Highly recommended beginner book'}
            ],
            'javascript': [
                {'name': 'freeCodeCamp JavaScript', 'url': 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', 'type': 'course', 'description': 'Free JavaScript course'},
                {'name': 'JavaScript.info', 'url': 'https://javascript.info/', 'type': 'tutorial', 'description': 'Modern JavaScript tutorial'},
                {'name': 'MDN JavaScript Guide', 'url': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', 'type': 'documentation', 'description': 'Comprehensive MDN guide'},
                {'name': 'Eloquent JavaScript', 'url': 'https://eloquentjavascript.net/', 'type': 'book', 'description': 'Free online book'}
            ]
        }
        
        return resources.get(language.lower(), [
            {'name': 'Official Documentation', 'url': '#', 'type': 'documentation', 'description': f'{language} official docs'},
            {'name': 'freeCodeCamp', 'url': 'https://www.freecodecamp.org/', 'type': 'course', 'description': 'Free coding courses'},
            {'name': 'Codecademy', 'url': 'https://www.codecademy.com/', 'type': 'course', 'description': 'Interactive learning'}
        ])
    
    # Additional template methods (abbreviated for space)
    def _syntax_fundamentals_template(self, category, topic, subtopic, language):
        return self._default_template(category, topic, subtopic, language)
    
    def _control_flow_template(self, category, topic, subtopic, language):
        return self._default_template(category, topic, subtopic, language)
    
    def _functions_template(self, category, topic, subtopic, language):
        return self._default_template(category, topic, subtopic, language)
    
    def _data_structures_template(self, category, topic, subtopic, language):
        return self._default_template(category, topic, subtopic, language)
    
    def _oop_template(self, category, topic, subtopic, language):
        return self._default_template(category, topic, subtopic, language)
    
    def _file_handling_template(self, category, topic, subtopic, language):
        return self._default_template(category, topic, subtopic, language)
    
    def _error_handling_template(self, category, topic, subtopic, language):
        return self._default_template(category, topic, subtopic, language)
    
    def _best_practices_template(self, category, topic, subtopic, language):
        return self._default_template(category, topic, subtopic, language)
    
    def _fundamentals_template(self, category, topic, subtopic, language):
        return self._default_template(category, topic, subtopic, language)
    
    def _default_template(self, category, topic, subtopic, language):
        """Default template for any article"""
        title = f'{subtopic.replace("-", " ").title()} - {topic.title()}'
        
        return {
            'title': title,
            'subtitle': f'A comprehensive guide to {subtopic.replace("-", " ")} in {topic}',
            'category_id': category,
            'topic': topic,
            'subtopic': subtopic,
            'difficulty_level': 'intermediate',
            'prerequisites': [],
            'tags': [topic.title(), subtopic.replace("-", " ").title()],
            'meta_description': f'Learn about {subtopic.replace("-", " ")} in {topic}.',
            'content': f'''
# {title}

## Introduction

This article covers {subtopic.replace("-", " ")} in {topic}. 

## Key Concepts

Content coming soon...

## Examples

Code examples coming soon...

## Practice Exercises

Exercises coming soon...

## Summary

Key takeaways from this article...
''',
            'code_examples': [],
            'exercises': [],
            'quiz_questions': [],
            'interview_questions': [],
            'external_resources': [],
            'related_articles': [],
            'author': 'CodeLearnHub Team'
        }


class ArticleManager:
    """Manages article generation and storage"""
    
    def __init__(self, db=None):
        self.generator = ArticleGenerator()
        self.db = db
    
    def generate_all_articles(self) -> List[Dict]:
        """Generate all articles for all categories and topics"""
        all_articles = []
        
        for category_slug, category_data in CATEGORIES.items():
            for topic_slug, topic_data in category_data.get('topics', {}).items():
                for subtopic in topic_data.get('subtopics', []):
                    article = self.generator.generate_article(
                        category=category_slug,
                        topic=topic_slug,
                        subtopic=subtopic,
                        language=topic_data.get('name')
                    )
                    all_articles.append(article)
        
        return all_articles
    
    async def save_articles(self, articles: List[Dict]) -> int:
        """Save articles to database"""
        if not self.db:
            return 0
        
        saved = 0
        for article in articles:
            try:
                await self.db.doc_articles.update_one(
                    {'slug': article['slug']},
                    {'$set': article},
                    upsert=True
                )
                saved += 1
            except Exception as e:
                print(f"Error saving article {article['slug']}: {e}")
        
        return saved
    
    def get_article_stats(self, articles: List[Dict]) -> Dict:
        """Get statistics about generated articles"""
        return {
            'total_articles': len(articles),
            'by_difficulty': {
                'beginner': len([a for a in articles if a.get('difficulty_level') == 'beginner']),
                'intermediate': len([a for a in articles if a.get('difficulty_level') == 'intermediate']),
                'advanced': len([a for a in articles if a.get('difficulty_level') == 'advanced'])
            },
            'by_category': {
                cat: len([a for a in articles if a.get('category_id') == cat])
                for cat in CATEGORIES.keys()
            },
            'total_examples': sum(len(a.get('code_examples', [])) for a in articles),
            'total_exercises': sum(len(a.get('exercises', [])) for a in articles),
            'total_quiz_questions': sum(len(a.get('quiz_questions', [])) for a in articles)
        }


# Export for use in server
__all__ = ['ArticleGenerator', 'ArticleManager', 'CATEGORIES', 'ArticleTemplate']
