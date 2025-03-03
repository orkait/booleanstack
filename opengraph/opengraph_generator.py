import os
import re
import hashlib
import time
import requests
import os
import sys
from image_processing import resize_and_optimize_image, blur_edges
from prng import prng_xorshift
sys.stdout.reconfigure(encoding='utf-8')


ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(ROOT_DIR, "..", 'src')
CONTENT_DIR = os.path.join(SRC_DIR, 'content')
BLOG_DIR = os.path.join(CONTENT_DIR, 'blog')
CACHE_DIR = os.path.join(ROOT_DIR, "..", "public", 'og')


# check if the cache directory exists if not create it
if not os.path.exists(CACHE_DIR):
    os.makedirs(CACHE_DIR)


def getDirs(rootPath, cacheIgnoreNames=[]):
    crawlingDirs = []
    crawlingDirs.append(rootPath)

    for root, dirs, _ in os.walk(rootPath, topdown=True):
        dirs[:] = [d for d in dirs if d not in cacheIgnoreNames]
        if (len(dirs) > 0):
            for dirr in dirs:
                crawlingDirs.append(os.path.join(root, dirr))
    return crawlingDirs


def getFiles(allowedExtensions=['*'], rootPath='', cacheIgnoreNames=[]):
    """
        `allowed_extensions:` list of allowed extensions (e.g., ['.txt', '.pdf'])
        `root_path:` root directory to start searching (default is current directory)
        `cache_ignore_names:` list of directory names to ignore

        `return:` list of files with specified extensions as dictionaries
    """
    files = []

    for i, item in enumerate(allowedExtensions):
        if len(item) >= 2 and item[0] == '.':
            allowedExtensions[i] = item[1:]

    for dirr in getDirs(
        rootPath=rootPath,
        cacheIgnoreNames=cacheIgnoreNames
    ):
        for f in os.listdir(dirr):
            fpath = os.path.join(dirr, f)
            if f not in files and not os.path.isdir(fpath):
                fileName = f.split('\\')[-1]
                if fileName is not None:
                    nameWithExt = fileName.split('.')
                    nameWithoutExt = '.'.join(nameWithExt[:-1])
                    if (len(nameWithExt) > 1):
                        extension = nameWithExt[-1]
                        if (extension in allowedExtensions) or ('*' in allowedExtensions):
                            files.append({
                                "fpath": fpath,
                                "directory": dirr,
                                "filename": f,
                                "extension": extension,
                                "filenameWithoutExtension": nameWithoutExt
                            })

    return files


def download_image(image_url: str, save_dir: str = "images", image_name: str = None):
    """
    Downloads an image from a URL and saves it locally.

    :param image_url: The URL of the image to download.
    :param save_dir: The directory where the image will be saved (default: "images").
    :param image_name: The name of the saved image file (default: extracted from URL).
    :return: The local file path of the saved image or None if download fails.
    """
    try:
        os.makedirs(save_dir, exist_ok=True)

        # Auto-generate filename if not provided
        if not image_name:
            image_name = image_url.split("/")[-1]  # Extract name from URL

        image_path = os.path.join(save_dir, image_name)

        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'}

        # Download the image
        response = requests.get(image_url, stream=True, timeout=10, headers=headers)
        response.raise_for_status()  # Raise error for bad responses (4xx, 5xx)

        with open(image_path, "wb") as file:
            for chunk in response.iter_content(1024):
                file.write(chunk)

        print(f"✅ Image downloaded: {image_path}")
        return image_path

    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to download {image_url}: {e}")
        return None


def og_generator():
    files = getFiles(
        allowedExtensions=['mdx'],
        rootPath=BLOG_DIR,
        cacheIgnoreNames=['.git', '__pycache__']
    )

    ogMap = {}

    # iterate over files
    for file in files:
        # open and read file
        with open(file['fpath'], 'r', encoding='utf-8', errors="replace") as f:
            content = f.read()

            # match regex cover:\s*"https:\/\/[^"]+"
            regex = r'cover:\s*"https:\/\/[^"]+\"'
            match = re.search(regex, content)

            if not match:
                raise Exception('Cover image found in file: ' + file['filename'])

            imageURL = match.group(0)

            result = re.split(r'cover:\s*', imageURL)
            if (len(result) <= 1):
                raise Exception('Cover image found in file: ' + file['filename'])

            result = result[1]

            # check if result startwith " and endswith "
            if not (result.startswith('"') and result.endswith('"')):
                raise Exception('Cover image found in file: ' + file['filename'])

            result = result[1:-1]

            # download_image(value['imageURL'], os.path.join(ROOT_DIR, 'cache'), value['hash'] + '.jpg')
            ogMap[file['filenameWithoutExtension']] = {
                'hash': prng_xorshift(file['filenameWithoutExtension']),
                'imageURL': result
            }

    # download image locally in a cache folder
    for key, value in ogMap.items():
        image_name = os.path.join(CACHE_DIR, value['hash'] + '.jpg')

        # check if image already exists in cache if not download it
        if os.path.exists(image_name):
            print(f"{key} already has skipping upload")
            continue

        # download image locally in a cache folder
        download_image(value['imageURL'], CACHE_DIR, value['hash'] + '.jpg')
        time.sleep(0.6)


        # resize and optimize the image
        resize_and_optimize_image(
            image_name,
            image_name,
            desired_width=1200,
            desired_height=630,
            max_size_kb=300
        )

        # blur the edges of the image
        blur_edges(
            image_name,
            image_name,
            blur_radius=1.4
        )

if __name__ == '__main__':
    og_generator()
