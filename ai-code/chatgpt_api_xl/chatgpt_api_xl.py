import requests
import json
import os

api_key = os.getenv("OPENAI_API_KEY") 


if not api_key:
    raise ValueError("Error: API Key not found. Please set OPENAI_API_KEY in your environment.")

print("API Key Loaded Successfully")

# 替换为你的API密钥
model_name = 'gpt-3.5-turbo'  # 或者 'gpt-4'，取决于你使用的模型
# 读取课程表文本文件
with open("courses.txt", "r", encoding="utf-8") as file:
    course_info = file.read()

# 要发送给ChatGPT的文本
prompt_text = prompt_text = f"""
我是UNSW COMP1521的tutor,我收到一条换课请求。
请你阅读这条信息，并参考下面的课程表来解析课程代码：
{course_info}
如果只换tutorial
请以 JSON 格式返回以下字段：
{{
    "day": "周几",
    "course_code": "课程代码",
    "type": "tut",
    "tut-time": "tut的时间段",
    "tut-room": "tut的实验室"
}}
如果只换lab
请以 JSON 格式返回以下字段：
{{
    "day": "周几",
    "course_code": "课程代码",
    "type": "lab",
    "lab-time": "lab的时间段",
    "lab-room": "lab的实验室"
}}
如果换tut+lab/tlb
请以 JSON 格式返回以下字段：
{{
    "day": "周几",
    "course_code": "课程代码",
    "type": "tlb",
    "tut-time": "tut的时间段",
    "tut-room": "tut的实验室",
    "lab-time": "lab的时间段",
    "lab-room": "lab的实验室"
}}

如果消息里没有提供具体的日期,默认从周一开始计算,比如输入消息里面没有明确周几,那消息里面的明天就是周二。
如果消息里面没有提及课程代码 然后重要信息缺少,就把你知道的填写就好了
还有一条消息可能包含多个换课要求你就分开来列就好了
"""+input()

# 设置请求头
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

# 设置请求体
data = {
    'model': model_name,
    'messages': [
        {'role': 'user', 'content': prompt_text}
    ]
}

# 注意：这里使用的是新的端点 v1/chat/completions
url = 'https://api.openai.com/v1/chat/completions'

# 发送请求到ChatGPT API
response = requests.post(url, headers=headers, json=data)

# 解析并打印响应
#print("response:\n")
response_data = response.json()
#print(json.dumps(response_data, indent=2))


print("answer:\n")
content = response_data['choices'][0]['message']['content']
print(content)

# 存入 response.txt
with open("response.txt", "w", encoding="utf-8") as file:
    file.write(content)

#print("ChatGPT 的回答已存入 response.txt")

