using FileReader.Api.Models;
using FileReader.Front.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace FileReader.Api.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IHostEnvironment HostingEnvironment;

        public FileController(IHostEnvironment hostingEnvironment)
        {
            HostingEnvironment = hostingEnvironment;
        }

        [Route("upload")]
        [HttpPost]
        public async Task<IActionResult> Read(IFormFile[] files)
        {
            if (files.Length == 0)
            {
                return BadRequest("File(s) not selected");
            }
            else
            {
                //Creating folder path
                var path = Path.Combine(HostingEnvironment.ContentRootPath, "files");
                if (!Directory.Exists(path)) Directory.CreateDirectory(path);

                //Read file
                var detectionFile = files.FirstOrDefault(x => x.FileName.ToLower().Equals("detections.json"));
                var detections = await ReadDetectionFileAsync(detectionFile, path);

                var timeBarsFile = files.FirstOrDefault(x => x.FileName.ToLower().Equals("time_bars_input.json"));
                var timeBars = await ReadTimeBarsFileAsync(timeBarsFile, path);

                var videoInformationFile = files.FirstOrDefault(x => x.FileName.ToLower().Equals("video_infos.json"));
                var videoInformation = await ReadVideoInformationFileAsync(videoInformationFile, path);

                return Ok(new FileUploadResponse(detections, timeBars, videoInformation));
            }
        }

        private async Task<List<Detection>> ReadDetectionFileAsync(IFormFile file, string path)
        {
            path = Path.Combine(path, file.FileName);

            using (var stream = new FileStream(path, FileMode.OpenOrCreate))
            {
                await file.CopyToAsync(stream);
            }

            var json = System.IO.File.ReadAllText(path);
            return JsonSerializer.Deserialize<List<Detection>>(json);
        }

        private async Task<VideoInformation> ReadVideoInformationFileAsync(IFormFile file, string path)
        {
            path = Path.Combine(path, file.FileName);

            using (var stream = new FileStream(path, FileMode.OpenOrCreate))
            {
                await file.CopyToAsync(stream);
            }

            var json = System.IO.File.ReadAllText(path);
            return JsonSerializer.Deserialize<VideoInformation>(json);
        }

        private async Task<List<TimeBar>> ReadTimeBarsFileAsync(IFormFile file, string path)
        {
            path = Path.Combine(path, file.FileName);

            using (var stream = new FileStream(path, FileMode.OpenOrCreate))
            {
                await file.CopyToAsync(stream);
            }

            var json = System.IO.File.ReadAllText(path);
            return JsonSerializer.Deserialize<List<TimeBar>>(json);
        }
    }
}