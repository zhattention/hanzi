#!/usr/bin/env python3
from PIL import Image
import os

def crop_and_resize(input_file, output_file, target_size=(200, 200)):
    """
    截取图片中心的方形区域，并调整大小到目标尺寸
    """
    try:
        # 打开图像
        with Image.open(input_file) as img:
            # 获取原始尺寸
            width, height = img.size
            
            # 计算中心方形区域
            # 使用较小的边作为方形的边长
            size = min(width, height)
            left = (width - size) // 2
            top = (height - size) // 2
            right = left + size
            bottom = top + size
            
            # 裁剪中心方形区域
            center_square = img.crop((left, top, right, bottom))
            
            # 调整大小为目标尺寸
            resized_img = center_square.resize(target_size, Image.LANCZOS)
            
            # 保存结果
            resized_img.save(output_file)
            
            print(f"处理完成: {output_file}")
            return True
    except Exception as e:
        print(f"处理 {input_file} 时出错: {e}")
        return False

def main():
    # 要处理的图片列表
    images = ["yes.png", "no.png", "maybe.png"]
    
    for img_file in images:
        # 构造输出文件名（添加_200x200后缀）
        base_name, ext = os.path.splitext(img_file)
        output_file = f"{base_name}_200x200{ext}"
        
        # 处理图片
        success = crop_and_resize(img_file, output_file)
        if success:
            print(f"已将 {img_file} 处理为 {output_file}")
        else:
            print(f"处理 {img_file} 失败")

if __name__ == "__main__":
    main() 