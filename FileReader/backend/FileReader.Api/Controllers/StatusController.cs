using Microsoft.AspNetCore.Mvc;

namespace FileReader.Api.Controllers
{
    [Route("api/status")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("I'm alive");
        }
    }
}