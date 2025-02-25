from PIL import Image, ImageStat, ImageFilter
import os
import numpy as np


def resize_and_optimize_image(image_path, output_path, desired_width=1200, desired_height=630, max_size_kb=200):
    """
    Resizes an image while maintaining aspect ratio, centers it on a canvas with the dominant background color, 
    and compresses it to be under a given size limit.

    :param image_path: Path to the input image
    :param output_path: Path to save the final image
    :param desired_width: Width of the final image (default: 1200)
    :param desired_height: Height of the final image (default: 630)
    :param max_size_kb: Maximum file size in KB (default: 200KB)
    """
    # Open the image
    image = Image.open(image_path)
    width, height = image.size
    aspect_ratio = width / height
    desired_aspect_ratio = desired_width / desired_height

    # Resize while maintaining aspect ratio
    if aspect_ratio > desired_aspect_ratio:
        new_width = desired_width
        new_height = int(new_width / aspect_ratio)
    else:
        new_height = desired_height
        new_width = int(new_height * aspect_ratio)

    # Resize the image while keeping aspect ratio
    resized_image = image.resize((new_width, new_height), Image.LANCZOS)

    # Find the dominant color in the image
    dominant_color = ImageStat.Stat(resized_image).median

    # Create a new blank image with the dominant background color
    canvas = Image.new("RGB", (desired_width, desired_height), tuple(dominant_color))

    # Compute the position to center the image
    x_offset = (desired_width - new_width) // 2
    y_offset = (desired_height - new_height) // 2

    # Paste the resized image onto the canvas
    canvas.paste(resized_image, (x_offset, y_offset))

    # check if the output image already exists
    # check if the size of the output image is less than the max_size_kb
    if os.path.getsize(output_path) < (max_size_kb * 1024):
        print("image already exists and is less than the max_size_kb")
        return

    quality = 96
    canvas.save(output_path, "JPEG", quality=quality)

    # Optimize further if size is more than max_size_kb
    while os.path.getsize(output_path) > (max_size_kb * 1024) and quality > 20:
        quality -= 3
        canvas.save(output_path, "JPEG", quality=quality)

    print(f"Image saved at {output_path} with final quality {quality}")


def blur_edges(image_path, output_path, blur_radius=20):
    """
    Blurs only the left and right sides of an image while keeping the center sharp.

    :param image_path: Path to the input image
    :param output_path: Path to save the final image
    :param blur_radius: Intensity of the blur on the sides (default: 20)
    """
    # Open the image
    image = Image.open(image_path)
    width, height = image.size

    # Create a blurred version of the image
    blurred_image = image.filter(ImageFilter.GaussianBlur(blur_radius))

    # Create a horizontal gradient mask (white at edges, black in center)
    mask = np.zeros((height, width), dtype=np.uint8)
    x = np.linspace(0, 1, width)  # Normalized x-coordinates from 0 to 1
    mask = np.where((x < 0.25) | (x > 0.75), 255, 0)  # Blur only at left & right
    mask = np.tile(mask, (height, 1)).astype(np.uint8)

    # Apply Gaussian blur to the mask for a smooth transition
    mask = Image.fromarray(mask, mode="L").filter(ImageFilter.GaussianBlur(50))

    # Blend the images using the mask (only blurring the left & right edges)
    final_image = Image.composite(blurred_image, image, mask)

    # Save the final output
    final_image.save(output_path)
    print(f"Blurred edges image saved at {output_path}")
