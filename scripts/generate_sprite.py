import cv2
import math
import os
from PIL import Image
import sys

# Configuration matches ModelShowcase.jsx
INPUT_VIDEO = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public/assets/model-showcase/bmw_m340i.mp4')
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public/assets/model-showcase/sprite.jpg')

# Target Settings for High Quality
TARGET_FRAME_COUNT = 192
COLS = 12
FRAME_WIDTH = 1280
FRAME_HEIGHT = 720
QUALITY = 92  # High JPEG quality (0-100)

def convert_video_to_sprite():
    print(f"Input video: {INPUT_VIDEO}")
    print(f"Output file: {OUTPUT_FILE}")

    if not os.path.exists(INPUT_VIDEO):
        print(f"Error: Input video not found at {INPUT_VIDEO}")
        return

    # Open the video
    cap = cv2.VideoCapture(INPUT_VIDEO)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return

    total_video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Total video frames: {total_video_frames}")

    # Calculate dimensions
    rows = math.ceil(TARGET_FRAME_COUNT / COLS)
    sheet_width = COLS * FRAME_WIDTH
    sheet_height = rows * FRAME_HEIGHT

    print(f"Creating sprite sheet: {sheet_width}x{sheet_height}")
    print(f"Target frames: {TARGET_FRAME_COUNT}")
    
    # Create blank canvas
    sprite_sheet = Image.new('RGB', (sheet_width, sheet_height), (0, 0, 0))

    try:
        for i in range(TARGET_FRAME_COUNT):
            # Calculate which frame to grab from video to spread them evenly
            # If video has more frames, we skip some. If fewer, we might duplicate (bu usually expect more)
            # Use linear interpolation logic
            frame_idx = int((i / TARGET_FRAME_COUNT) * total_video_frames)
            
            # Set video position
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
            ret, frame = cap.read()
            
            if not ret:
                print(f"Warning: Could not read frame {frame_idx}")
                break

            # Convert BGR (OpenCV) to RGB (PIL)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(frame_rgb)

            # Resize with LANCZOS for best quality
            img_resized = pil_img.resize((FRAME_WIDTH, FRAME_HEIGHT), Image.Resampling.LANCZOS)

            # Calculate position
            col = i % COLS
            row = i // COLS
            x = col * FRAME_WIDTH
            y = row * FRAME_HEIGHT

            # Paste
            sprite_sheet.paste(img_resized, (x, y))
            
            # Progressbar
            percent = int((i + 1) / TARGET_FRAME_COUNT * 100)
            sys.stdout.write(f"\rProcessing: [{('=' * (percent // 2)).ljust(50)}] {percent}% (Frame {i+1}/{TARGET_FRAME_COUNT})")
            sys.stdout.flush()

    except Exception as e:
        print(f"\nError processing frames: {e}")
    finally:
        cap.release()

    # Save
    print("\nSaving high-quality sprite sheet (this might take a moment)...")
    # Increase max image pixels to allow saving large images
    Image.MAX_IMAGE_PIXELS = None 
    
    try:
        sprite_sheet.save(OUTPUT_FILE, format='JPEG', quality=QUALITY, optimize=True)
        print(f"Successfully saved to {OUTPUT_FILE}")
        print(f"Final size: {sheet_width}x{sheet_height}")
    except Exception as e:
        print(f"Error saving image: {e}")

if __name__ == "__main__":
    convert_video_to_sprite()
