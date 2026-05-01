"""
Article Seed Data Generator for CodeLearnHub
Generates comprehensive educational content with full article structures
"""

import uuid
from datetime import datetime, timezone
from typing import List, Dict


def generate_article_id():
    return f"article_{uuid.uuid4().hex[:12]}"


# =============================================================================
# PROGRAMMING LANGUAGES ARTICLES
# =============================================================================

PYTHON_ARTICLES = [
    {
        "article_id": generate_article_id(),
        "slug": "getting-started-with-python",
        "title": "Getting Started with Python",
        "subtitle": "Your complete guide to beginning your Python programming journey",
        "category_id": "programming-languages",
        "topic": "python",
        "subtopic": "getting-started",
        "difficulty_level": "beginner",
        "prerequisites": [],
        "tags": ["Python", "Beginner", "Tutorial", "Setup", "Installation"],
        "meta_description": "Learn Python from scratch. This beginner-friendly guide covers installation, setup, and writing your first Python program.",
        "estimated_reading_time": 15,
        "author": "CodeLearnHub Team",
        "content": """
# Getting Started with Python

Welcome to your Python programming journey! This comprehensive guide will take you from complete beginner to writing your first Python programs.

## Introduction

### What is Python?

Python is a high-level, interpreted programming language created by Guido van Rossum and first released in 1991. It emphasizes code readability with its notable use of significant whitespace and simple, clean syntax.

### Why Learn Python?

- **Easy to Learn**: Python's syntax is designed to be readable and straightforward
- **Versatile**: Used in web development, data science, AI, automation, and more
- **Strong Community**: Millions of developers and extensive documentation
- **Career Opportunities**: One of the most in-demand programming languages
- **Rich Ecosystem**: Thousands of libraries and frameworks available

### What You'll Learn

By the end of this guide, you will:
- Understand what Python is and its applications
- Set up Python on your computer
- Write and run your first Python program
- Understand basic syntax and data types
- Know where to go next in your learning journey

## Setting Up Your Development Environment

### Installing Python

#### Windows

1. Visit [python.org](https://www.python.org/downloads/)
2. Download the latest Python 3.x version
3. Run the installer
4. **Important**: Check "Add Python to PATH"
5. Click "Install Now"
6. Verify installation:
   ```bash
   python --version
   ```

#### macOS

```bash
# Using Homebrew (recommended)
brew install python

# Verify installation
python3 --version
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install python3 python3-pip

# Verify installation
python3 --version
```

### Choosing an IDE

**Visual Studio Code** (Recommended for beginners)
- Free and open-source
- Excellent Python extension
- Built-in terminal and debugger

**PyCharm**
- Full-featured Python IDE
- Community edition is free
- Powerful debugging and refactoring tools

**Jupyter Notebook**
- Interactive coding environment
- Great for data science and learning
- Combines code, output, and documentation

## Your First Python Program

### Hello, World!

Create a new file called `hello.py` and add:

```python
# My first Python program
print("Hello, World!")
```

Run it from the terminal:

```bash
python hello.py
```

Output:
```
Hello, World!
```

Congratulations! You've written your first Python program! 🎉

### Understanding the Code

- `#` starts a comment - text that Python ignores
- `print()` is a built-in function that displays output
- `"Hello, World!"` is a string - text enclosed in quotes

## Variables and Data Types

### Variables

Variables store data values. Python uses dynamic typing - you don't need to declare types explicitly.

```python
# String variable
name = "Alice"

# Integer variable
age = 25

# Float variable
height = 5.6

# Boolean variable
is_student = True

# Using variables
print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height}")
print(f"Is Student: {is_student}")
```

### Python Data Types

| Type | Description | Example |
|------|-------------|---------|
| `str` | Text/String | `"Hello"` |
| `int` | Integer | `42` |
| `float` | Decimal | `3.14` |
| `bool` | Boolean | `True` / `False` |
| `list` | Ordered collection | `[1, 2, 3]` |
| `dict` | Key-value pairs | `{"name": "Alice"}` |
| `tuple` | Immutable collection | `(1, 2, 3)` |
| `set` | Unique collection | `{1, 2, 3}` |
| `None` | Null value | `None` |

### Type Checking

```python
# Check variable type
name = "Alice"
age = 25

print(type(name))  # <class 'str'>
print(type(age))   # <class 'int'>

# Type conversion
str_number = "42"
int_number = int(str_number)
print(int_number + 8)  # 50
```

## Basic Input and Output

### Getting User Input

```python
# Simple input
name = input("What is your name? ")
print(f"Hello, {name}!")

# Input with type conversion
age = int(input("How old are you? "))
next_year = age + 1
print(f"Next year you'll be {next_year}")
```

### Formatted Output

```python
# f-strings (Python 3.6+) - Recommended
name = "Alice"
age = 25
print(f"My name is {name} and I am {age} years old.")

# format() method
print("My name is {} and I am {} years old.".format(name, age))

# % formatting (older style)
print("My name is %s and I am %d years old." % (name, age))
```

## Basic Operators

### Arithmetic Operators

```python
a = 10
b = 3

print(f"Addition: {a + b}")        # 13
print(f"Subtraction: {a - b}")     # 7
print(f"Multiplication: {a * b}")  # 30
print(f"Division: {a / b}")        # 3.333...
print(f"Floor Division: {a // b}") # 3
print(f"Modulus: {a % b}")         # 1
print(f"Exponent: {a ** b}")       # 1000
```

### Comparison Operators

```python
x = 5
y = 10

print(f"Equal: {x == y}")           # False
print(f"Not Equal: {x != y}")       # True
print(f"Greater: {x > y}")          # False
print(f"Less: {x < y}")             # True
print(f"Greater or Equal: {x >= y}") # False
print(f"Less or Equal: {x <= y}")    # True
```

## Mini Project: Personal Info Card

Let's create a simple program that generates a personal info card:

```python
# Personal Info Card Generator
print("=" * 40)
print("    PERSONAL INFO CARD GENERATOR")
print("=" * 40)

# Get user information
name = input("Enter your name: ")
age = int(input("Enter your age: "))
city = input("Enter your city: ")
hobby = input("Enter your favorite hobby: ")

# Generate the card
print("\\n" + "=" * 40)
print(f"  Name: {name}")
print(f"  Age: {age}")
print(f"  City: {city}")
print(f"  Hobby: {hobby}")
print("=" * 40)

# Calculate birth year
from datetime import datetime
birth_year = datetime.now().year - age
print(f"  Born around: {birth_year}")
print("=" * 40)
```

## Common Mistakes and How to Avoid Them

### 1. Indentation Errors

```python
# Wrong ❌
if True:
print("Hello")

# Correct ✅
if True:
    print("Hello")
```

### 2. Forgetting Quotes for Strings

```python
# Wrong ❌
name = Alice

# Correct ✅
name = "Alice"
```

### 3. Case Sensitivity

```python
# Variables are case-sensitive
Name = "Alice"
name = "Bob"

print(Name)  # Alice
print(name)  # Bob
```

### 4. Integer Division vs Float Division

```python
# Integer division
result = 10 // 3  # 3

# Float division
result = 10 / 3   # 3.333...
```

## Best Practices for Beginners

1. **Use meaningful variable names**
   ```python
   # Bad
   x = 25
   
   # Good
   user_age = 25
   ```

2. **Write comments for complex code**
   ```python
   # Calculate compound interest
   amount = principal * (1 + rate/100) ** years
   ```

3. **Follow PEP 8 style guide**
   - Use 4 spaces for indentation
   - Use snake_case for variables and functions
   - Keep lines under 79 characters

4. **Test your code frequently**

5. **Read error messages carefully**

## Summary

Congratulations! You've learned:

✅ What Python is and why it's popular
✅ How to install Python and set up your environment
✅ Writing and running your first program
✅ Variables and basic data types
✅ Input and output operations
✅ Basic operators
✅ Common mistakes to avoid
✅ Best practices for writing Python code

## Next Steps

Continue your Python journey with these topics:

1. **Control Flow** - if/else statements and loops
2. **Functions** - Writing reusable code
3. **Data Structures** - Lists, dictionaries, and more
4. **Object-Oriented Programming** - Classes and objects

Happy coding! 🐍✨
""",
        "code_examples": [
            {
                "id": "py-hello-world",
                "title": "Hello World",
                "description": "Your first Python program",
                "code": '''# My first Python program
print("Hello, World!")''',
                "language": "python",
                "expected_output": "Hello, World!",
                "explanation": "The print() function outputs text to the console. Strings are enclosed in quotes.",
                "is_runnable": True
            },
            {
                "id": "py-variables",
                "title": "Variables and Types",
                "description": "Declaring different types of variables",
                "code": '''# Declaring variables
name = "Alice"      # String
age = 25           # Integer
height = 5.6       # Float
is_student = True  # Boolean

# Print all variables
print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height}")
print(f"Student: {is_student}")

# Check types
print(f"Type of name: {type(name)}")
print(f"Type of age: {type(age)}")''',
                "language": "python",
                "expected_output": "Name: Alice\nAge: 25\nHeight: 5.6\nStudent: True\nType of name: <class 'str'>\nType of age: <class 'int'>",
                "explanation": "Python uses dynamic typing. The type() function shows the data type of a variable.",
                "is_runnable": True
            },
            {
                "id": "py-user-input",
                "title": "User Input",
                "description": "Getting input from users",
                "code": '''# Getting user input
name = input("What is your name? ")
age = int(input("How old are you? "))

# Use the input
print(f"Hello, {name}!")
print(f"You are {age} years old.")
print(f"Next year you will be {age + 1}.")''',
                "language": "python",
                "expected_output": "What is your name? [input]\nHow old are you? [input]\nHello, [name]!\nYou are [age] years old.\nNext year you will be [age+1].",
                "explanation": "input() always returns a string. Use int() or float() to convert to numbers.",
                "is_runnable": False
            },
            {
                "id": "py-arithmetic",
                "title": "Arithmetic Operations",
                "description": "Basic math operations in Python",
                "code": '''a = 10
b = 3

print(f"Addition: {a} + {b} = {a + b}")
print(f"Subtraction: {a} - {b} = {a - b}")
print(f"Multiplication: {a} * {b} = {a * b}")
print(f"Division: {a} / {b} = {a / b:.2f}")
print(f"Floor Division: {a} // {b} = {a // b}")
print(f"Modulus: {a} % {b} = {a % b}")
print(f"Exponent: {a} ** {b} = {a ** b}")''',
                "language": "python",
                "expected_output": "Addition: 10 + 3 = 13\nSubtraction: 10 - 3 = 7\nMultiplication: 10 * 3 = 30\nDivision: 10 / 3 = 3.33\nFloor Division: 10 // 3 = 3\nModulus: 10 % 3 = 1\nExponent: 10 ** 3 = 1000",
                "explanation": "Python supports all standard arithmetic operators plus floor division (//) and exponentiation (**).",
                "is_runnable": True
            },
            {
                "id": "py-string-operations",
                "title": "String Operations",
                "description": "Common string methods and operations",
                "code": '''text = "Hello, Python World!"

print(f"Original: {text}")
print(f"Uppercase: {text.upper()}")
print(f"Lowercase: {text.lower()}")
print(f"Length: {len(text)}")
print(f"First char: {text[0]}")
print(f"Last char: {text[-1]}")
print(f"Slice [0:5]: {text[0:5]}")
print(f"Replace: {text.replace('World', 'Universe')}")
print(f"Split: {text.split()}")''',
                "language": "python",
                "expected_output": "Original: Hello, Python World!\nUppercase: HELLO, PYTHON WORLD!\nLowercase: hello, python world!\nLength: 20\nFirst char: H\nLast char: !\nSlice [0:5]: Hello\nReplace: Hello, Python Universe!\nSplit: ['Hello,', 'Python', 'World!']",
                "explanation": "Strings have many built-in methods. Indexing starts at 0, and negative indices count from the end.",
                "is_runnable": True
            }
        ],
        "exercises": [
            {
                "id": "py-ex-greeting",
                "title": "Personalized Greeting",
                "difficulty": "beginner",
                "problem": "Write a program that asks for the user's name and age, then prints a personalized greeting message that includes:\n1. A welcome message with their name\n2. Their age\n3. The year they were born",
                "hints": [
                    "Use input() to get the user's name",
                    "Use int(input()) to get the age as a number",
                    "Calculate birth year: current_year - age",
                    "Use f-strings for formatted output"
                ],
                "solution": '''from datetime import datetime

# Get user input
name = input("What is your name? ")
age = int(input("How old are you? "))

# Calculate birth year
current_year = datetime.now().year
birth_year = current_year - age

# Print greeting
print(f"\\nHello, {name}! Welcome to Python!")
print(f"You are {age} years old.")
print(f"You were born around {birth_year}.")''',
                "test_cases": [
                    {"input": "Alice\\n25", "expected_contains": ["Alice", "25", "1999"]},
                    {"input": "Bob\\n30", "expected_contains": ["Bob", "30"]}
                ]
            },
            {
                "id": "py-ex-calculator",
                "title": "Simple Calculator",
                "difficulty": "beginner",
                "problem": "Create a simple calculator that:\n1. Asks the user for two numbers\n2. Performs all arithmetic operations (+, -, *, /, //, %, **)\n3. Displays the results in a formatted way",
                "hints": [
                    "Use float() for decimal number support",
                    "Remember to handle division by zero",
                    "Use f-strings for clean output formatting"
                ],
                "solution": '''# Simple Calculator
print("=" * 30)
print("   SIMPLE CALCULATOR")
print("=" * 30)

# Get numbers from user
num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))

# Perform calculations
print(f"\\n{num1} + {num2} = {num1 + num2}")
print(f"{num1} - {num2} = {num1 - num2}")
print(f"{num1} * {num2} = {num1 * num2}")

# Handle division by zero
if num2 != 0:
    print(f"{num1} / {num2} = {num1 / num2:.2f}")
    print(f"{num1} // {num2} = {num1 // num2}")
    print(f"{num1} % {num2} = {num1 % num2}")
else:
    print("Cannot divide by zero!")

print(f"{num1} ** {num2} = {num1 ** num2}")''',
                "test_cases": [
                    {"input": "10\\n3", "expected_contains": ["13", "7", "30", "3.33"]},
                    {"input": "5\\n0", "expected_contains": ["Cannot divide by zero"]}
                ]
            },
            {
                "id": "py-ex-temperature",
                "title": "Temperature Converter",
                "difficulty": "beginner",
                "problem": "Build a temperature converter that:\n1. Asks the user for a temperature in Celsius\n2. Converts it to Fahrenheit (F = C × 9/5 + 32)\n3. Converts it to Kelvin (K = C + 273.15)\n4. Displays all three temperatures",
                "hints": [
                    "Get input as float for decimal temperatures",
                    "Apply the formulas correctly",
                    "Format output to 2 decimal places using :.2f"
                ],
                "solution": '''# Temperature Converter
print("TEMPERATURE CONVERTER")
print("-" * 30)

# Get temperature in Celsius
celsius = float(input("Enter temperature in Celsius: "))

# Convert to other units
fahrenheit = celsius * 9/5 + 32
kelvin = celsius + 273.15

# Display results
print(f"\\n{celsius:.2f}°C is equal to:")
print(f"  • {fahrenheit:.2f}°F (Fahrenheit)")
print(f"  • {kelvin:.2f}K (Kelvin)")''',
                "test_cases": [
                    {"input": "0", "expected_contains": ["32", "273.15"]},
                    {"input": "100", "expected_contains": ["212", "373.15"]}
                ]
            }
        ],
        "quiz_questions": [
            {
                "id": "py-q1",
                "question": "What function is used to output text to the console in Python?",
                "options": ["echo()", "print()", "console.log()", "write()"],
                "correct_answer": 1,
                "explanation": "Python uses the print() function to display output to the console."
            },
            {
                "id": "py-q2",
                "question": "Which of the following is the correct way to create a comment in Python?",
                "options": ["// This is a comment", "/* This is a comment */", "# This is a comment", "-- This is a comment"],
                "correct_answer": 2,
                "explanation": "Python uses the # symbol for single-line comments."
            },
            {
                "id": "py-q3",
                "question": "What is the data type of the value 3.14 in Python?",
                "options": ["int", "str", "float", "double"],
                "correct_answer": 2,
                "explanation": "Decimal numbers in Python are represented as float (floating-point numbers)."
            },
            {
                "id": "py-q4",
                "question": "What does the // operator do in Python?",
                "options": ["Regular division", "Floor division (integer division)", "Exponentiation", "Modulus"],
                "correct_answer": 1,
                "explanation": "The // operator performs floor division, returning only the integer part of the division."
            },
            {
                "id": "py-q5",
                "question": "Which function is used to get user input in Python?",
                "options": ["read()", "scan()", "input()", "get()"],
                "correct_answer": 2,
                "explanation": "The input() function reads text input from the user and returns it as a string."
            }
        ],
        "interview_questions": [
            {
                "question": "What is Python and why is it popular?",
                "answer": "Python is a high-level, interpreted programming language known for its simple, readable syntax. It's popular because of its versatility (web, data science, AI, automation), large community, extensive libraries, and gentle learning curve.",
                "follow_up": "Can you name some popular frameworks or libraries in Python?"
            },
            {
                "question": "What's the difference between Python 2 and Python 3?",
                "answer": "Python 3 introduced print as a function, integer division behavior changed, strings are Unicode by default, and many standard library modules were reorganized. Python 2 is no longer supported since January 2020.",
                "follow_up": "Why might some projects still use Python 2?"
            },
            {
                "question": "What are Python's key features?",
                "answer": "Key features include: dynamic typing, interpreted execution, indentation-based syntax, extensive standard library, support for multiple paradigms (procedural, OOP, functional), and platform independence.",
                "follow_up": "What is dynamic typing and how does it differ from static typing?"
            }
        ],
        "external_resources": [
            {"name": "Official Python Tutorial", "url": "https://docs.python.org/3/tutorial/", "type": "documentation", "description": "The official Python tutorial from python.org"},
            {"name": "Python for Everybody", "url": "https://www.py4e.com/", "type": "course", "description": "Free online Python course by Dr. Charles Severance"},
            {"name": "Real Python", "url": "https://realpython.com/", "type": "tutorial", "description": "High-quality Python tutorials and articles"},
            {"name": "Codecademy Python", "url": "https://www.codecademy.com/learn/learn-python-3", "type": "course", "description": "Interactive Python learning platform"},
            {"name": "Automate the Boring Stuff", "url": "https://automatetheboringstuff.com/", "type": "book", "description": "Free online book for practical Python automation"}
        ],
        "related_articles": ["python-control-flow", "python-functions", "python-data-structures"],
        "is_published": True,
        "view_count": 0,
        "helpful_count": 0,
        "not_helpful_count": 0
    },
    {
        "article_id": generate_article_id(),
        "slug": "python-control-flow",
        "title": "Python Control Flow: Conditions and Loops",
        "subtitle": "Master if statements, for loops, and while loops in Python",
        "category_id": "programming-languages",
        "topic": "python",
        "subtopic": "control-flow",
        "difficulty_level": "beginner",
        "prerequisites": ["getting-started-with-python"],
        "tags": ["Python", "Control Flow", "If Statements", "Loops", "Conditionals"],
        "meta_description": "Learn how to control program flow in Python using if/else statements, for loops, and while loops with practical examples.",
        "estimated_reading_time": 20,
        "author": "CodeLearnHub Team",
        "content": """
# Python Control Flow: Conditions and Loops

Control flow is the order in which individual statements are executed. In this guide, you'll learn how to make decisions and repeat actions in your Python programs.

## Conditional Statements

### The if Statement

The `if` statement executes code only when a condition is true.

```python
age = 18

if age >= 18:
    print("You are an adult")
```

### if-else Statement

Execute different code based on whether a condition is true or false.

```python
age = 16

if age >= 18:
    print("You can vote")
else:
    print("You cannot vote yet")
```

### if-elif-else Chain

Handle multiple conditions:

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is {grade}")
```

## Comparison Operators

| Operator | Meaning |
|----------|---------|
| `==` | Equal to |
| `!=` | Not equal to |
| `>` | Greater than |
| `<` | Less than |
| `>=` | Greater than or equal |
| `<=` | Less than or equal |

## Logical Operators

Combine conditions using `and`, `or`, and `not`:

```python
age = 25
has_license = True

if age >= 18 and has_license:
    print("You can drive")

if age < 13 or age > 65:
    print("Special discount available")

if not has_license:
    print("Please get a license first")
```

## For Loops

### Iterating Over Lists

```python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)
```

### Using range()

```python
# Print numbers 0-4
for i in range(5):
    print(i)

# Print numbers 1-5
for i in range(1, 6):
    print(i)

# Print even numbers 2-10
for i in range(2, 11, 2):
    print(i)
```

## While Loops

```python
count = 0

while count < 5:
    print(f"Count: {count}")
    count += 1
```

## Loop Control Statements

### break - Exit the loop

```python
for i in range(10):
    if i == 5:
        break
    print(i)
# Prints: 0, 1, 2, 3, 4
```

### continue - Skip to next iteration

```python
for i in range(5):
    if i == 2:
        continue
    print(i)
# Prints: 0, 1, 3, 4
```

## Nested Loops

```python
for i in range(3):
    for j in range(3):
        print(f"({i}, {j})", end=" ")
    print()
```

## Summary

- Use `if/elif/else` for decision making
- Use `for` loops when you know how many times to iterate
- Use `while` loops when iteration depends on a condition
- Use `break` to exit a loop early
- Use `continue` to skip iterations
""",
        "code_examples": [
            {
                "id": "py-cf-if-else",
                "title": "If-Else Statement",
                "description": "Basic conditional logic",
                "code": '''age = 18

if age >= 18:
    print("You are an adult")
    print("You can vote")
else:
    print("You are a minor")
    print("You cannot vote yet")''',
                "language": "python",
                "expected_output": "You are an adult\nYou can vote",
                "explanation": "The if block executes when the condition is True, otherwise the else block runs.",
                "is_runnable": True
            },
            {
                "id": "py-cf-for-range",
                "title": "For Loop with Range",
                "description": "Iterating with range()",
                "code": '''# Basic range
print("Numbers 0-4:")
for i in range(5):
    print(i, end=" ")

print("\\n\\nNumbers 1-5:")
for i in range(1, 6):
    print(i, end=" ")

print("\\n\\nEven numbers 2-10:")
for i in range(2, 11, 2):
    print(i, end=" ")''',
                "language": "python",
                "expected_output": "Numbers 0-4:\n0 1 2 3 4\n\nNumbers 1-5:\n1 2 3 4 5\n\nEven numbers 2-10:\n2 4 6 8 10",
                "explanation": "range(stop), range(start, stop), or range(start, stop, step) generates a sequence of numbers.",
                "is_runnable": True
            }
        ],
        "exercises": [
            {
                "id": "py-cf-ex1",
                "title": "Grade Calculator",
                "difficulty": "beginner",
                "problem": "Write a program that asks for a test score and outputs the letter grade using this scale: A (90-100), B (80-89), C (70-79), D (60-69), F (below 60)",
                "hints": ["Use if-elif-else chain", "Check from highest to lowest grade"],
                "solution": '''score = int(input("Enter your score: "))

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is: {grade}")''',
                "test_cases": [{"input": "85", "expected_contains": ["B"]}]
            },
            {
                "id": "py-cf-ex2",
                "title": "FizzBuzz",
                "difficulty": "beginner",
                "problem": "Print numbers 1-20. For multiples of 3, print 'Fizz'. For multiples of 5, print 'Buzz'. For multiples of both, print 'FizzBuzz'.",
                "hints": ["Check divisibility with modulo %", "Check for both 3 and 5 first"],
                "solution": '''for i in range(1, 21):
    if i % 3 == 0 and i % 5 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)''',
                "test_cases": []
            }
        ],
        "quiz_questions": [
            {
                "id": "py-cf-q1",
                "question": "What will be printed?\n\nx = 5\nif x > 3:\n    print('A')\nelse:\n    print('B')",
                "options": ["A", "B", "AB", "Error"],
                "correct_answer": 0,
                "explanation": "Since x (5) is greater than 3, the condition is True and 'A' is printed."
            }
        ],
        "interview_questions": [
            {
                "question": "What's the difference between 'break' and 'continue'?",
                "answer": "'break' exits the loop entirely, while 'continue' skips the rest of the current iteration and moves to the next one.",
                "follow_up": "When would you use each?"
            }
        ],
        "external_resources": [
            {"name": "Python Control Flow - Official Docs", "url": "https://docs.python.org/3/tutorial/controlflow.html", "type": "documentation", "description": "Official documentation on control flow"}
        ],
        "related_articles": ["getting-started-with-python", "python-functions"],
        "is_published": True,
        "view_count": 0,
        "helpful_count": 0,
        "not_helpful_count": 0
    },
    {
        "article_id": generate_article_id(),
        "slug": "python-functions",
        "title": "Python Functions: Writing Reusable Code",
        "subtitle": "Learn to create, call, and master functions in Python",
        "category_id": "programming-languages",
        "topic": "python",
        "subtopic": "functions",
        "difficulty_level": "beginner",
        "prerequisites": ["getting-started-with-python", "python-control-flow"],
        "tags": ["Python", "Functions", "Parameters", "Return Values", "Scope"],
        "meta_description": "Master Python functions from basic definitions to advanced concepts like args, kwargs, and lambda functions.",
        "estimated_reading_time": 25,
        "author": "CodeLearnHub Team",
        "content": """
# Python Functions: Writing Reusable Code

Functions are reusable blocks of code that perform a specific task. They help you organize your code, avoid repetition, and make programs easier to understand.

## Defining Functions

### Basic Function Definition

```python
def greet():
    print("Hello, World!")

# Call the function
greet()
```

### Functions with Parameters

```python
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
greet("Bob")
```

### Multiple Parameters

```python
def add(a, b):
    result = a + b
    print(f"{a} + {b} = {result}")

add(5, 3)
```

## Return Values

```python
def multiply(a, b):
    return a * b

result = multiply(4, 5)
print(result)  # 20
```

### Multiple Return Values

```python
def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers)

minimum, maximum, total = get_stats([1, 2, 3, 4, 5])
```

## Default Parameters

```python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Alice")              # Hello, Alice!
greet("Bob", "Hi")          # Hi, Bob!
```

## *args and **kwargs

### *args - Variable Positional Arguments

```python
def sum_all(*numbers):
    return sum(numbers)

print(sum_all(1, 2, 3))       # 6
print(sum_all(1, 2, 3, 4, 5)) # 15
```

### **kwargs - Variable Keyword Arguments

```python
def build_profile(**info):
    return info

profile = build_profile(name="Alice", age=25, city="NYC")
print(profile)  # {'name': 'Alice', 'age': 25, 'city': 'NYC'}
```

## Lambda Functions

Short anonymous functions:

```python
# Regular function
def square(x):
    return x ** 2

# Lambda equivalent
square = lambda x: x ** 2

print(square(5))  # 25
```

## Variable Scope

```python
global_var = "I'm global"

def my_function():
    local_var = "I'm local"
    print(global_var)  # Can access global
    print(local_var)   # Can access local

my_function()
# print(local_var)  # Error! local_var is not accessible here
```

## Summary

- Functions help organize and reuse code
- Use `def` to define functions
- Parameters allow passing data into functions
- `return` sends data back to the caller
- Use default parameters for optional values
- `*args` and `**kwargs` for flexible parameters
- Lambda functions for simple one-liners
""",
        "code_examples": [
            {
                "id": "py-fn-basic",
                "title": "Basic Function",
                "description": "Simple function with a parameter",
                "code": '''def greet(name):
    """Greets a person by name."""
    message = f"Hello, {name}! Welcome!"
    return message

# Call the function
result = greet("Alice")
print(result)

# Call with different name
print(greet("Bob"))''',
                "language": "python",
                "expected_output": "Hello, Alice! Welcome!\nHello, Bob! Welcome!",
                "explanation": "Functions are defined with 'def', can take parameters, and can return values.",
                "is_runnable": True
            }
        ],
        "exercises": [
            {
                "id": "py-fn-ex1",
                "title": "Calculator Functions",
                "difficulty": "beginner",
                "problem": "Create functions for add, subtract, multiply, and divide. Each function should take two parameters and return the result.",
                "hints": ["Create a separate function for each operation", "Handle division by zero"],
                "solution": '''def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Cannot divide by zero"
    return a / b

# Test the functions
print(f"10 + 5 = {add(10, 5)}")
print(f"10 - 5 = {subtract(10, 5)}")
print(f"10 * 5 = {multiply(10, 5)}")
print(f"10 / 5 = {divide(10, 5)}")''',
                "test_cases": []
            }
        ],
        "quiz_questions": [
            {
                "id": "py-fn-q1",
                "question": "What keyword is used to return a value from a function?",
                "options": ["send", "return", "output", "yield"],
                "correct_answer": 1,
                "explanation": "The 'return' keyword is used to send a value back from a function to the caller."
            }
        ],
        "interview_questions": [
            {
                "question": "What's the difference between *args and **kwargs?",
                "answer": "*args collects positional arguments into a tuple, while **kwargs collects keyword arguments into a dictionary. They allow functions to accept a variable number of arguments.",
                "follow_up": "Can you use both in the same function?"
            }
        ],
        "external_resources": [
            {"name": "Python Functions - W3Schools", "url": "https://www.w3schools.com/python/python_functions.asp", "type": "tutorial", "description": "Beginner-friendly function tutorial"}
        ],
        "related_articles": ["python-control-flow", "python-oop"],
        "is_published": True,
        "view_count": 0,
        "helpful_count": 0,
        "not_helpful_count": 0
    }
]


# =============================================================================
# JAVASCRIPT ARTICLES
# =============================================================================

JAVASCRIPT_ARTICLES = [
    {
        "article_id": generate_article_id(),
        "slug": "getting-started-with-javascript",
        "title": "Getting Started with JavaScript",
        "subtitle": "Begin your journey into the world's most popular programming language",
        "category_id": "programming-languages",
        "topic": "javascript",
        "subtopic": "getting-started",
        "difficulty_level": "beginner",
        "prerequisites": [],
        "tags": ["JavaScript", "Beginner", "Tutorial", "Web Development"],
        "meta_description": "Learn JavaScript from scratch with this comprehensive beginner guide covering setup, syntax, and your first programs.",
        "estimated_reading_time": 18,
        "author": "CodeLearnHub Team",
        "content": """
# Getting Started with JavaScript

JavaScript is the language of the web. It brings websites to life by adding interactivity, dynamic content, and modern user experiences.

## What is JavaScript?

JavaScript is a versatile, high-level programming language that runs in web browsers and on servers (Node.js). It's essential for:

- **Frontend Development**: Adding interactivity to websites
- **Backend Development**: Building server applications with Node.js
- **Mobile Apps**: Creating apps with React Native or Ionic
- **Desktop Apps**: Building apps with Electron

## Setting Up Your Environment

### Browser Console

The easiest way to start is using your browser's developer console:

1. Open any browser (Chrome, Firefox, Edge)
2. Press F12 or right-click → Inspect
3. Click the "Console" tab
4. Start typing JavaScript!

### Code Editors

**Visual Studio Code** (Recommended)
- Free and powerful
- Excellent JavaScript support
- Live Server extension for testing

## Your First JavaScript

### In the Browser Console

```javascript
console.log("Hello, World!");
```

### In an HTML File

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First JavaScript</title>
</head>
<body>
    <h1>Hello JavaScript!</h1>
    
    <script>
        console.log("Hello from JavaScript!");
        alert("Welcome!");
    </script>
</body>
</html>
```

## Variables

### Declaring Variables

```javascript
// Modern way (recommended)
let name = "Alice";
const PI = 3.14159;

// Older way (avoid)
var age = 25;
```

**Key differences:**
- `let` - Can be reassigned
- `const` - Cannot be reassigned (constant)
- `var` - Old way, function-scoped (avoid in modern JS)

### Data Types

```javascript
// String
let greeting = "Hello";

// Number
let age = 25;
let price = 19.99;

// Boolean
let isActive = true;

// Undefined
let unknown;

// Null
let empty = null;

// Array
let colors = ["red", "green", "blue"];

// Object
let person = {
    name: "Alice",
    age: 25
};
```

## Operators

### Arithmetic

```javascript
let a = 10, b = 3;

console.log(a + b);  // 13
console.log(a - b);  // 7
console.log(a * b);  // 30
console.log(a / b);  // 3.333...
console.log(a % b);  // 1 (modulus)
console.log(a ** b); // 1000 (exponent)
```

### Comparison

```javascript
console.log(5 == "5");   // true (loose equality)
console.log(5 === "5");  // false (strict equality)
console.log(5 !== "5");  // true
```

## Template Literals

```javascript
let name = "Alice";
let age = 25;

// Template literal (backticks)
let message = `Hello, ${name}! You are ${age} years old.`;
console.log(message);
```

## Summary

- JavaScript is essential for web development
- Use `let` and `const` for variables
- JavaScript has various data types
- Use template literals for string formatting
- `===` for strict equality, `==` for loose equality

## Next Steps

- Learn about control flow (if/else, loops)
- Explore functions
- Understand arrays and objects
- Dive into DOM manipulation
""",
        "code_examples": [
            {
                "id": "js-hello",
                "title": "Hello World",
                "description": "Your first JavaScript program",
                "code": '''// Print to console
console.log("Hello, World!");

// Display an alert (in browser)
// alert("Welcome to JavaScript!");''',
                "language": "javascript",
                "expected_output": "Hello, World!",
                "explanation": "console.log() outputs to the browser or Node.js console. alert() shows a popup in browsers.",
                "is_runnable": True
            },
            {
                "id": "js-variables",
                "title": "Variables and Types",
                "description": "Declaring variables in JavaScript",
                "code": '''// Using let (can be reassigned)
let name = "Alice";
let age = 25;

// Using const (cannot be reassigned)
const PI = 3.14159;
const isStudent = true;

// Check types
console.log("Name:", name, "- Type:", typeof name);
console.log("Age:", age, "- Type:", typeof age);
console.log("PI:", PI, "- Type:", typeof PI);
console.log("Is Student:", isStudent, "- Type:", typeof isStudent);''',
                "language": "javascript",
                "expected_output": "Name: Alice - Type: string\nAge: 25 - Type: number\nPI: 3.14159 - Type: number\nIs Student: true - Type: boolean",
                "explanation": "Use 'let' for variables that change, 'const' for constants. 'typeof' returns the type as a string.",
                "is_runnable": True
            }
        ],
        "exercises": [
            {
                "id": "js-ex1",
                "title": "Personal Profile",
                "difficulty": "beginner",
                "problem": "Create variables for your name, age, city, and hobby. Use template literals to create and log a sentence introducing yourself.",
                "hints": ["Use const or let for each variable", "Use backticks for template literals", "Use ${} for variable interpolation"],
                "solution": '''const name = "Alice";
const age = 25;
const city = "New York";
const hobby = "coding";

const introduction = `Hi! My name is ${name}. I'm ${age} years old and I live in ${city}. I love ${hobby}!`;

console.log(introduction);''',
                "test_cases": []
            }
        ],
        "quiz_questions": [
            {
                "id": "js-q1",
                "question": "Which keyword should you use for a variable that will never be reassigned?",
                "options": ["var", "let", "const", "static"],
                "correct_answer": 2,
                "explanation": "'const' declares a constant that cannot be reassigned after initialization."
            },
            {
                "id": "js-q2",
                "question": "What is the result of: 5 === '5'?",
                "options": ["true", "false", "undefined", "Error"],
                "correct_answer": 1,
                "explanation": "=== is strict equality, comparing both value and type. 5 (number) !== '5' (string)."
            }
        ],
        "interview_questions": [
            {
                "question": "What's the difference between var, let, and const?",
                "answer": "'var' is function-scoped and can be redeclared. 'let' is block-scoped and can be reassigned. 'const' is block-scoped and cannot be reassigned. Modern JavaScript uses let and const.",
                "follow_up": "What is hoisting and how does it affect var vs let?"
            }
        ],
        "external_resources": [
            {"name": "MDN JavaScript Guide", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", "type": "documentation", "description": "Comprehensive JavaScript documentation"},
            {"name": "JavaScript.info", "url": "https://javascript.info/", "type": "tutorial", "description": "Modern JavaScript tutorial"}
        ],
        "related_articles": ["javascript-control-flow", "javascript-functions"],
        "is_published": True,
        "view_count": 0,
        "helpful_count": 0,
        "not_helpful_count": 0
    }
]


# =============================================================================
# WEB DEVELOPMENT ARTICLES
# =============================================================================

REACT_ARTICLES = [
    {
        "article_id": generate_article_id(),
        "slug": "getting-started-with-react",
        "title": "Getting Started with React",
        "subtitle": "Build modern user interfaces with the most popular JavaScript library",
        "category_id": "web-development",
        "topic": "react",
        "subtopic": "getting-started",
        "difficulty_level": "beginner",
        "prerequisites": ["getting-started-with-javascript"],
        "tags": ["React", "JavaScript", "Frontend", "Components", "JSX"],
        "meta_description": "Learn React from scratch. Set up your first React project and understand components, JSX, and the basics of building UIs.",
        "estimated_reading_time": 22,
        "author": "CodeLearnHub Team",
        "content": """
# Getting Started with React

React is a JavaScript library for building user interfaces. Created by Facebook, it's become the most popular choice for building modern web applications.

## Why React?

- **Component-Based**: Build encapsulated components that manage their own state
- **Declarative**: Describe what your UI should look like, React handles the updates
- **Learn Once, Write Anywhere**: Use React for web, mobile (React Native), and more
- **Large Ecosystem**: Huge community and extensive library support

## Setting Up Your First React Project

### Using Create React App

```bash
npx create-react-app my-first-react-app
cd my-first-react-app
npm start
```

This creates a new React project and starts a development server at `http://localhost:3000`.

### Using Vite (Faster Alternative)

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

## Understanding the Project Structure

```
my-first-react-app/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Your First React Component

### App.js

```jsx
function App() {
  return (
    <div className="App">
      <h1>Hello, React!</h1>
      <p>Welcome to my first React app.</p>
    </div>
  );
}

export default App;
```

## Understanding JSX

JSX is a syntax extension that lets you write HTML-like code in JavaScript:

```jsx
// JSX
const element = <h1>Hello, World!</h1>;

// Equivalent JavaScript
const element = React.createElement('h1', null, 'Hello, World!');
```

### JSX Rules

1. **Return a single parent element**
```jsx
// Wrong ❌
return (
  <h1>Title</h1>
  <p>Content</p>
);

// Correct ✅
return (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
);

// Or use Fragment
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);
```

2. **Use `className` instead of `class`**
```jsx
<div className="container">Content</div>
```

3. **Use `{}` for JavaScript expressions**
```jsx
const name = "Alice";
return <h1>Hello, {name}!</h1>;
```

4. **Close all tags**
```jsx
<img src="photo.jpg" alt="Photo" />
<input type="text" />
```

## Creating Components

### Function Components

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Usage
<Greeting name="Alice" />
```

### Arrow Function Components

```jsx
const Greeting = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};
```

## Props

Props are inputs to components, passed like HTML attributes:

```jsx
function UserCard({ name, age, city }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>City: {city}</p>
    </div>
  );
}

// Usage
<UserCard name="Alice" age={25} city="New York" />
```

## State with useState

State lets components remember and update data:

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## Handling Events

```jsx
function Button() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

## Conditional Rendering

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please log in.</h1>;
}

// Using ternary operator
return (
  <div>
    {isLoggedIn ? <Dashboard /> : <Login />}
  </div>
);
```

## Lists and Keys

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

## Summary

- React uses components to build UIs
- JSX combines JavaScript and HTML-like syntax
- Props pass data to components
- useState manages component state
- Events use camelCase: onClick, onChange
- Always use keys when rendering lists
""",
        "code_examples": [
            {
                "id": "react-hello",
                "title": "Hello React Component",
                "description": "A simple React component",
                "code": '''import React from 'react';

function App() {
  const name = "React Developer";
  
  return (
    <div className="App">
      <h1>Hello, {name}!</h1>
      <p>Welcome to your first React component.</p>
    </div>
  );
}

export default App;''',
                "language": "jsx",
                "expected_output": "Renders: Hello, React Developer! Welcome to your first React component.",
                "explanation": "A function component that returns JSX. The curly braces {} allow JavaScript expressions.",
                "is_runnable": False
            },
            {
                "id": "react-counter",
                "title": "Counter with useState",
                "description": "Managing state in a functional component",
                "code": '''import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Counter;''',
                "language": "jsx",
                "expected_output": "A counter that can be incremented, decremented, or reset.",
                "explanation": "useState returns [currentValue, setterFunction]. Clicking buttons calls the setter to update state.",
                "is_runnable": False
            }
        ],
        "exercises": [
            {
                "id": "react-ex1",
                "title": "Profile Card Component",
                "difficulty": "beginner",
                "problem": "Create a ProfileCard component that accepts name, role, and imageUrl as props and displays a formatted profile card.",
                "hints": ["Use props destructuring", "Apply CSS classes for styling", "Use template literals for alt text"],
                "solution": '''function ProfileCard({ name, role, imageUrl }) {
  return (
    <div className="profile-card">
      <img 
        src={imageUrl} 
        alt={`${name}'s profile`}
        className="profile-image"
      />
      <h2>{name}</h2>
      <p className="role">{role}</p>
    </div>
  );
}

// Usage
<ProfileCard 
  name="Alice Johnson"
  role="Frontend Developer"
  imageUrl="https://example.com/alice.jpg"
/>''',
                "test_cases": []
            }
        ],
        "quiz_questions": [
            {
                "id": "react-q1",
                "question": "What is JSX?",
                "options": ["A new programming language", "A syntax extension for JavaScript", "A CSS framework", "A database query language"],
                "correct_answer": 1,
                "explanation": "JSX is a syntax extension for JavaScript that lets you write HTML-like code in your JavaScript files."
            },
            {
                "id": "react-q2",
                "question": "Which hook is used to add state to a functional component?",
                "options": ["useEffect", "useState", "useContext", "useReducer"],
                "correct_answer": 1,
                "explanation": "useState is the React hook used to add state variables to functional components."
            }
        ],
        "interview_questions": [
            {
                "question": "What is the Virtual DOM and why does React use it?",
                "answer": "The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React uses it to optimize rendering by comparing the new Virtual DOM with the previous one (diffing), then only updating the parts of the real DOM that changed (reconciliation).",
                "follow_up": "What is reconciliation in React?"
            }
        ],
        "external_resources": [
            {"name": "Official React Docs", "url": "https://react.dev/", "type": "documentation", "description": "The new official React documentation"},
            {"name": "React Tutorial", "url": "https://react.dev/learn", "type": "tutorial", "description": "Interactive React tutorial"}
        ],
        "related_articles": ["react-hooks", "react-state-management"],
        "is_published": True,
        "view_count": 0,
        "helpful_count": 0,
        "not_helpful_count": 0
    }
]


# =============================================================================
# DATA SCIENCE & AI ARTICLES
# =============================================================================

DATA_SCIENCE_ARTICLES = [
    {
        "article_id": generate_article_id(),
        "slug": "introduction-to-pandas",
        "title": "Introduction to Pandas for Data Analysis",
        "subtitle": "Master the essential Python library for data manipulation and analysis",
        "category_id": "data-science-ai",
        "topic": "python-data-science",
        "subtopic": "pandas",
        "difficulty_level": "beginner",
        "prerequisites": ["getting-started-with-python"],
        "tags": ["Pandas", "Python", "Data Science", "Data Analysis", "DataFrames"],
        "meta_description": "Learn Pandas from scratch. Understand DataFrames, Series, and essential data manipulation techniques for data analysis.",
        "estimated_reading_time": 25,
        "author": "CodeLearnHub Team",
        "content": """
# Introduction to Pandas for Data Analysis

Pandas is the go-to Python library for data manipulation and analysis. It provides powerful, flexible data structures that make working with data intuitive and efficient.

## What is Pandas?

Pandas provides two main data structures:
- **Series**: A one-dimensional labeled array
- **DataFrame**: A two-dimensional table (like a spreadsheet)

## Installation

```bash
pip install pandas
```

## Getting Started

```python
import pandas as pd
import numpy as np

# Check version
print(pd.__version__)
```

## Pandas Series

A Series is like a column in a spreadsheet:

```python
# Create a Series
s = pd.Series([1, 2, 3, 4, 5])
print(s)

# Series with custom index
s = pd.Series([100, 200, 300], index=['a', 'b', 'c'])
print(s['b'])  # 200
```

## Pandas DataFrame

A DataFrame is like a table:

```python
# Create DataFrame from dictionary
data = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [25, 30, 35],
    'City': ['NYC', 'LA', 'Chicago']
}

df = pd.DataFrame(data)
print(df)
```

Output:
```
      Name  Age     City
0    Alice   25      NYC
1      Bob   30       LA
2  Charlie   35  Chicago
```

## Reading Data

```python
# Read CSV
df = pd.read_csv('data.csv')

# Read Excel
df = pd.read_excel('data.xlsx')

# Read JSON
df = pd.read_json('data.json')
```

## Exploring Data

```python
# First few rows
df.head()

# Last few rows
df.tail()

# Shape (rows, columns)
df.shape

# Column names
df.columns

# Data types
df.dtypes

# Summary statistics
df.describe()

# Information about DataFrame
df.info()
```

## Selecting Data

### Selecting Columns

```python
# Single column (returns Series)
df['Name']

# Multiple columns (returns DataFrame)
df[['Name', 'Age']]
```

### Selecting Rows

```python
# By index position (iloc)
df.iloc[0]      # First row
df.iloc[0:3]    # First 3 rows

# By label (loc)
df.loc[0]       # Row with index 0
df.loc[0:2]     # Rows 0 to 2 (inclusive)
```

### Conditional Selection

```python
# Filter rows where Age > 25
df[df['Age'] > 25]

# Multiple conditions
df[(df['Age'] > 25) & (df['City'] == 'LA')]
```

## Adding and Modifying Data

```python
# Add a new column
df['Salary'] = [50000, 60000, 70000]

# Modify values
df.loc[0, 'Age'] = 26

# Apply function to column
df['Age_Plus_10'] = df['Age'].apply(lambda x: x + 10)
```

## Handling Missing Data

```python
# Check for missing values
df.isnull().sum()

# Drop rows with missing values
df.dropna()

# Fill missing values
df.fillna(0)
df.fillna(df['Column'].mean())
```

## Grouping and Aggregation

```python
# Group by and calculate mean
df.groupby('City')['Age'].mean()

# Multiple aggregations
df.groupby('City').agg({
    'Age': ['mean', 'max', 'min'],
    'Salary': 'sum'
})
```

## Sorting

```python
# Sort by column
df.sort_values('Age')
df.sort_values('Age', ascending=False)

# Sort by multiple columns
df.sort_values(['City', 'Age'])
```

## Saving Data

```python
# Save to CSV
df.to_csv('output.csv', index=False)

# Save to Excel
df.to_excel('output.xlsx', index=False)

# Save to JSON
df.to_json('output.json')
```

## Summary

- Series: 1D labeled array
- DataFrame: 2D labeled table
- Use `.head()`, `.info()`, `.describe()` to explore data
- Select data with `[]`, `.loc[]`, `.iloc[]`
- Handle missing data with `.dropna()` or `.fillna()`
- Group data with `.groupby()` and aggregate
""",
        "code_examples": [
            {
                "id": "pd-create-df",
                "title": "Creating a DataFrame",
                "description": "Different ways to create a Pandas DataFrame",
                "code": '''import pandas as pd

# From dictionary
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'Diana'],
    'Age': [25, 30, 35, 28],
    'City': ['New York', 'Los Angeles', 'Chicago', 'Houston'],
    'Salary': [70000, 80000, 75000, 72000]
}

df = pd.DataFrame(data)

print("DataFrame:")
print(df)
print("\\nShape:", df.shape)
print("\\nColumns:", list(df.columns))
print("\\nData types:")
print(df.dtypes)''',
                "language": "python",
                "expected_output": "DataFrame with 4 rows and 4 columns...",
                "explanation": "DataFrames can be created from dictionaries, lists, or read from files.",
                "is_runnable": True
            }
        ],
        "exercises": [
            {
                "id": "pd-ex1",
                "title": "Sales Data Analysis",
                "difficulty": "beginner",
                "problem": "Given a DataFrame with sales data (Product, Category, Price, Quantity), calculate:\n1. Total revenue per product\n2. Average price per category\n3. Top 3 products by quantity sold",
                "hints": ["Add Revenue column: Price * Quantity", "Use groupby for category analysis", "Use sort_values and head(3)"],
                "solution": '''import pandas as pd

# Sample data
data = {
    'Product': ['A', 'B', 'C', 'D', 'E'],
    'Category': ['Electronics', 'Electronics', 'Clothing', 'Clothing', 'Food'],
    'Price': [100, 150, 50, 75, 25],
    'Quantity': [10, 5, 20, 15, 30]
}
df = pd.DataFrame(data)

# 1. Total revenue per product
df['Revenue'] = df['Price'] * df['Quantity']
print("Revenue per product:")
print(df[['Product', 'Revenue']])

# 2. Average price per category
print("\\nAverage price per category:")
print(df.groupby('Category')['Price'].mean())

# 3. Top 3 products by quantity
print("\\nTop 3 products by quantity:")
print(df.nlargest(3, 'Quantity')[['Product', 'Quantity']])''',
                "test_cases": []
            }
        ],
        "quiz_questions": [
            {
                "id": "pd-q1",
                "question": "What is the difference between a Series and a DataFrame?",
                "options": ["No difference", "Series is 1D, DataFrame is 2D", "DataFrame is 1D, Series is 2D", "Series is faster"],
                "correct_answer": 1,
                "explanation": "A Series is a one-dimensional labeled array, while a DataFrame is a two-dimensional table with rows and columns."
            }
        ],
        "interview_questions": [
            {
                "question": "How do you handle missing data in Pandas?",
                "answer": "You can use df.dropna() to remove rows with missing values, df.fillna(value) to replace missing values with a specific value or the mean/median, or df.interpolate() for interpolation-based filling.",
                "follow_up": "When would you choose to drop vs fill missing values?"
            }
        ],
        "external_resources": [
            {"name": "Pandas Official Docs", "url": "https://pandas.pydata.org/docs/", "type": "documentation", "description": "Official Pandas documentation"},
            {"name": "10 Minutes to Pandas", "url": "https://pandas.pydata.org/docs/user_guide/10min.html", "type": "tutorial", "description": "Quick Pandas introduction"}
        ],
        "related_articles": ["numpy-fundamentals", "matplotlib-visualization"],
        "is_published": True,
        "view_count": 0,
        "helpful_count": 0,
        "not_helpful_count": 0
    }
]


# =============================================================================
# ALGORITHMS & DSA ARTICLES
# =============================================================================

DSA_ARTICLES = [
    {
        "article_id": generate_article_id(),
        "slug": "big-o-notation-guide",
        "title": "Big O Notation: Complete Guide",
        "subtitle": "Understand algorithm complexity and write efficient code",
        "category_id": "algorithms-dsa",
        "topic": "fundamentals",
        "subtopic": "big-o-notation",
        "difficulty_level": "beginner",
        "prerequisites": [],
        "tags": ["Big O", "Algorithms", "Time Complexity", "Space Complexity", "DSA"],
        "meta_description": "Master Big O notation to analyze algorithm efficiency. Learn about time and space complexity with practical examples.",
        "estimated_reading_time": 20,
        "author": "CodeLearnHub Team",
        "content": """
# Big O Notation: Complete Guide

Big O notation is the language we use to describe how efficient an algorithm is. It tells us how the runtime or space requirements grow as the input size increases.

## Why Big O Matters

- **Compare algorithms** objectively
- **Predict performance** as data grows
- **Ace coding interviews**
- **Write better code**

## Common Time Complexities

### O(1) - Constant Time

The algorithm takes the same amount of time regardless of input size.

```python
def get_first(arr):
    return arr[0]  # Always one operation
```

### O(log n) - Logarithmic Time

The algorithm reduces the problem size by half each step.

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

### O(n) - Linear Time

The algorithm examines each element once.

```python
def find_max(arr):
    max_val = arr[0]
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val
```

### O(n log n) - Linearithmic Time

Common in efficient sorting algorithms.

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)
```

### O(n²) - Quadratic Time

Nested iterations over the input.

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
```

### O(2ⁿ) - Exponential Time

Often seen in recursive solutions without memoization.

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

## Complexity Comparison

| Complexity | n=10 | n=100 | n=1000 |
|------------|------|-------|--------|
| O(1) | 1 | 1 | 1 |
| O(log n) | 3 | 7 | 10 |
| O(n) | 10 | 100 | 1000 |
| O(n log n) | 33 | 664 | 9966 |
| O(n²) | 100 | 10,000 | 1,000,000 |
| O(2ⁿ) | 1,024 | 10³⁰ | ∞ |

## Space Complexity

Space complexity measures memory usage:

```python
# O(1) Space
def sum_array(arr):
    total = 0
    for num in arr:
        total += num
    return total

# O(n) Space
def double_array(arr):
    return [x * 2 for x in arr]
```

## Rules for Big O

1. **Drop constants**: O(2n) → O(n)
2. **Drop non-dominant terms**: O(n² + n) → O(n²)
3. **Different inputs, different variables**: O(a + b) stays as is
4. **Worst case is default**: Unless specified otherwise

## Interview Tips

1. Always state your complexity after coding
2. Consider both time AND space
3. Look for optimization opportunities
4. Practice with common patterns

## Summary

- Big O describes algorithm efficiency
- Focus on how growth scales, not exact counts
- Common complexities: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)
- Consider both time and space complexity
""",
        "code_examples": [
            {
                "id": "dsa-complexity",
                "title": "Complexity Examples",
                "description": "Examples of different time complexities",
                "code": '''# O(1) - Constant
def get_first(arr):
    return arr[0] if arr else None

# O(n) - Linear
def find_sum(arr):
    total = 0
    for num in arr:
        total += num
    return total

# O(n²) - Quadratic
def has_duplicate(arr):
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                return True
    return False

# Test
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print(f"First: {get_first(numbers)}")          # O(1)
print(f"Sum: {find_sum(numbers)}")              # O(n)
print(f"Has duplicate: {has_duplicate(numbers)}") # O(n²)''',
                "language": "python",
                "expected_output": "First: 1\nSum: 55\nHas duplicate: False",
                "explanation": "Each function demonstrates a different time complexity based on how it processes the input.",
                "is_runnable": True
            }
        ],
        "exercises": [
            {
                "id": "dsa-ex1",
                "title": "Analyze Complexity",
                "difficulty": "beginner",
                "problem": "Determine the time and space complexity of each function and explain why.",
                "hints": ["Count nested loops", "Check for recursive calls", "Look at data structures created"],
                "solution": '''# 1. O(n) time, O(1) space - single loop, no extra space
def example1(arr):
    count = 0
    for x in arr:
        if x > 0:
            count += 1
    return count

# 2. O(n²) time, O(1) space - nested loops
def example2(arr):
    for i in arr:
        for j in arr:
            print(i, j)

# 3. O(n) time, O(n) space - creates new array of size n
def example3(arr):
    return [x * 2 for x in arr]

# 4. O(log n) time, O(1) space - halves search space each iteration
def example4(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1''',
                "test_cases": []
            }
        ],
        "quiz_questions": [
            {
                "id": "dsa-q1",
                "question": "What is the time complexity of accessing an element by index in an array?",
                "options": ["O(n)", "O(1)", "O(log n)", "O(n²)"],
                "correct_answer": 1,
                "explanation": "Array index access is O(1) because arrays store elements in contiguous memory, allowing direct access via memory address calculation."
            }
        ],
        "interview_questions": [
            {
                "question": "Why do we drop constants in Big O notation?",
                "answer": "We drop constants because Big O describes the growth rate as input approaches infinity. Constants become insignificant compared to the dominant term. For example, O(2n) and O(n) both grow linearly, so they're both O(n).",
                "follow_up": "In what scenarios might constants actually matter?"
            }
        ],
        "external_resources": [
            {"name": "Big O Cheat Sheet", "url": "https://www.bigocheatsheet.com/", "type": "reference", "description": "Visual Big O complexity reference"},
            {"name": "MIT OpenCourseWare - Algorithms", "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/", "type": "course", "description": "MIT's algorithm course"}
        ],
        "related_articles": ["arrays-fundamentals", "sorting-algorithms"],
        "is_published": True,
        "view_count": 0,
        "helpful_count": 0,
        "not_helpful_count": 0
    }
]


# =============================================================================
# AI & PROMPT ENGINEERING ARTICLES
# =============================================================================

PROMPT_ENGINEERING_ARTICLES = [
    {
        "article_id": generate_article_id(),
        "slug": "prompt-engineering-fundamentals",
        "title": "Prompt Engineering Fundamentals",
        "subtitle": "Master the art of communicating effectively with AI language models",
        "category_id": "ai-prompt-engineering",
        "topic": "prompt-engineering",
        "subtopic": "fundamentals",
        "difficulty_level": "beginner",
        "prerequisites": [],
        "tags": ["Prompt Engineering", "AI", "ChatGPT", "LLM", "GPT"],
        "meta_description": "Learn the fundamentals of prompt engineering to get better results from AI language models like ChatGPT, Claude, and GPT-4.",
        "estimated_reading_time": 18,
        "author": "CodeLearnHub Team",
        "content": """
# Prompt Engineering Fundamentals

Prompt engineering is the skill of crafting effective inputs to get the best outputs from AI language models. It's become essential for developers, writers, and professionals working with AI.

## What is Prompt Engineering?

A **prompt** is the text you send to an AI model. **Prompt engineering** is the process of designing and refining prompts to get desired outputs.

## Why It Matters

- Get more accurate, relevant responses
- Save time by reducing trial and error
- Unlock advanced AI capabilities
- Build better AI-powered applications

## Anatomy of a Good Prompt

A well-structured prompt typically includes:

1. **Context**: Background information
2. **Task**: What you want the AI to do
3. **Instructions**: How to do it
4. **Format**: Desired output format
5. **Examples**: (Optional) Demonstrations

## Basic Prompting Techniques

### 1. Be Specific and Clear

❌ Vague prompt:
```
Write about Python.
```

✅ Specific prompt:
```
Write a 200-word beginner-friendly introduction to Python programming. 
Cover what Python is, why it's popular, and include 3 real-world use cases.
Format the response with headers and bullet points.
```

### 2. Provide Context

❌ No context:
```
How do I fix this?
```

✅ With context:
```
I'm a junior developer building a React app. I'm getting this error:
"TypeError: Cannot read property 'map' of undefined"

My code:
const items = props.data;
return items.map(item => <li>{item.name}</li>);

What's causing this error and how can I fix it?
```

### 3. Define the Output Format

```
Analyze the following customer review and provide:
1. Sentiment: (Positive/Negative/Neutral)
2. Key Topics: (comma-separated list)
3. Summary: (1-2 sentences)

Review: "[customer review here]"
```

### 4. Use Role-Based Prompts

```
You are an experienced Python developer and educator. 
Explain list comprehensions to a beginner who knows basic loops.
Include 3 progressive examples from simple to advanced.
```

## Advanced Techniques

### Chain-of-Thought Prompting

Ask the AI to explain its reasoning:

```
Solve this problem step by step:
A store has a 20% off sale. If a shirt originally costs $45, 
what is the sale price? Show your work.
```

### Few-Shot Learning

Provide examples to guide the output:

```
Convert these sentences to a professional tone:

Input: "Hey, can u send me the report?"
Output: "Could you please send me the report at your earliest convenience?"

Input: "The meeting was boring and too long."
Output: "The meeting could have been more concise and engaging."

Input: "I don't get why this is hard for you."
Output:
```

### Self-Consistency

Ask for multiple approaches and verify:

```
Provide 3 different approaches to solve this problem:
[problem description]

Then compare the approaches and recommend the best one with justification.
```

## Common Mistakes to Avoid

1. **Being too vague** - Ambiguous prompts lead to generic responses
2. **Overloading the prompt** - Too many requests in one prompt
3. **Ignoring context** - Not providing necessary background
4. **Not specifying format** - Getting unstructured responses
5. **Not iterating** - Giving up after one attempt

## Prompt Templates

### Code Generation
```
Write a [language] function that [does something].

Requirements:
- Input: [describe input]
- Output: [describe output]
- Handle edge cases: [list cases]

Include comments and example usage.
```

### Explanation
```
Explain [concept] as if I'm a [expertise level] [role].
Use analogies and examples.
Keep it under [word count] words.
```

### Review/Feedback
```
Review this [code/text] for:
1. [Criterion 1]
2. [Criterion 2]
3. [Criterion 3]

Provide specific suggestions for improvement.
```

## Best Practices

1. **Start simple, then add complexity**
2. **Iterate and refine your prompts**
3. **Save successful prompts for reuse**
4. **Test with different inputs**
5. **Learn from the model's responses**

## Summary

- Prompt engineering is essential for effective AI interaction
- Be specific, provide context, and define output format
- Use techniques like chain-of-thought and few-shot learning
- Iterate and refine your prompts
- Create reusable templates for common tasks
""",
        "code_examples": [
            {
                "id": "pe-comparison",
                "title": "Prompt Comparison",
                "description": "Comparing vague vs specific prompts",
                "code": '''# Example prompts for code generation

# Vague Prompt ❌
vague_prompt = """
Write a function to sort a list.
"""

# Specific Prompt ✅
specific_prompt = """
Write a Python function called 'sort_by_age' that:
- Takes a list of dictionaries, each with 'name' and 'age' keys
- Returns a new list sorted by age in ascending order
- Handles empty lists gracefully

Example input: [{'name': 'Alice', 'age': 30}, {'name': 'Bob', 'age': 25}]
Expected output: [{'name': 'Bob', 'age': 25}, {'name': 'Alice', 'age': 30}]

Include type hints and a docstring.
"""

print("The specific prompt provides:")
print("1. Function name")
print("2. Input format")
print("3. Expected behavior")
print("4. Edge case handling")
print("5. Example")
print("6. Code quality requirements")''',
                "language": "python",
                "expected_output": "Comparison of prompt specificity",
                "explanation": "Specific prompts lead to better, more usable outputs from AI models.",
                "is_runnable": True
            }
        ],
        "exercises": [
            {
                "id": "pe-ex1",
                "title": "Improve This Prompt",
                "difficulty": "beginner",
                "problem": "Transform this vague prompt into a specific, well-structured prompt:\n\nOriginal: 'Write code to handle users'",
                "hints": ["What programming language?", "What should the code do?", "What's the input/output?", "Any specific requirements?"],
                "solution": '''# Improved Prompt:

"""
Write a Python class called 'UserManager' with the following features:

1. Properties:
   - users: a list to store user dictionaries

2. Methods:
   - add_user(name: str, email: str, role: str) -> dict
     Creates a new user with a unique ID, returns the user dict
   
   - get_user(user_id: str) -> dict or None
     Retrieves a user by ID
   
   - update_user(user_id: str, **kwargs) -> bool
     Updates user fields, returns True if successful
   
   - delete_user(user_id: str) -> bool
     Removes a user, returns True if successful

Requirements:
- Use UUID for user IDs
- Validate email format
- Include type hints
- Add docstrings for each method
- Handle edge cases (user not found, invalid email, etc.)

Example usage:
manager = UserManager()
user = manager.add_user("Alice", "alice@example.com", "admin")
print(manager.get_user(user['id']))
"""''',
                "test_cases": []
            }
        ],
        "quiz_questions": [
            {
                "id": "pe-q1",
                "question": "Which technique involves providing examples in your prompt to guide the AI's output?",
                "options": ["Chain-of-thought prompting", "Zero-shot prompting", "Few-shot prompting", "Role-based prompting"],
                "correct_answer": 2,
                "explanation": "Few-shot prompting provides examples in the prompt to demonstrate the desired pattern or format for the AI to follow."
            }
        ],
        "interview_questions": [
            {
                "question": "What is chain-of-thought prompting and when would you use it?",
                "answer": "Chain-of-thought prompting asks the AI to show its reasoning step by step before providing a final answer. It's useful for complex problems, mathematical calculations, logical reasoning, and debugging, as it helps the model arrive at more accurate conclusions and allows you to verify its reasoning.",
                "follow_up": "Can you give an example of a chain-of-thought prompt?"
            }
        ],
        "external_resources": [
            {"name": "OpenAI Prompt Engineering Guide", "url": "https://platform.openai.com/docs/guides/prompt-engineering", "type": "documentation", "description": "Official OpenAI prompt engineering guide"},
            {"name": "Learn Prompting", "url": "https://learnprompting.org/", "type": "course", "description": "Free prompt engineering course"}
        ],
        "related_articles": ["advanced-prompting-techniques", "ai-coding-assistants"],
        "is_published": True,
        "view_count": 0,
        "helpful_count": 0,
        "not_helpful_count": 0
    }
]


# =============================================================================
# COMBINE ALL ARTICLES
# =============================================================================

def get_all_seed_articles():
    """Returns all seed articles with timestamps"""
    all_articles = (
        PYTHON_ARTICLES +
        JAVASCRIPT_ARTICLES +
        REACT_ARTICLES +
        DATA_SCIENCE_ARTICLES +
        DSA_ARTICLES +
        PROMPT_ENGINEERING_ARTICLES
    )
    
    # Add timestamps to all articles
    now = datetime.now(timezone.utc).isoformat()
    for article in all_articles:
        article['created_at'] = now
        article['updated_at'] = now
    
    return all_articles


def get_article_stats():
    """Returns statistics about the seed articles"""
    articles = get_all_seed_articles()
    
    return {
        'total_articles': len(articles),
        'by_category': {},
        'by_difficulty': {'beginner': 0, 'intermediate': 0, 'advanced': 0},
        'total_code_examples': sum(len(a.get('code_examples', [])) for a in articles),
        'total_exercises': sum(len(a.get('exercises', [])) for a in articles),
        'total_quiz_questions': sum(len(a.get('quiz_questions', [])) for a in articles)
    }


if __name__ == "__main__":
    # Print statistics
    stats = get_article_stats()
    print(f"Total Articles: {stats['total_articles']}")
    print(f"Code Examples: {stats['total_code_examples']}")
    print(f"Exercises: {stats['total_exercises']}")
    print(f"Quiz Questions: {stats['total_quiz_questions']}")
