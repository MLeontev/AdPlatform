#nullable disable

using Microsoft.EntityFrameworkCore.Migrations;

namespace AdPlatform.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserLink_AspNetUsers_UserId",
                table: "UserLink");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserLink",
                table: "UserLink");

            migrationBuilder.RenameTable(
                name: "UserLink",
                newName: "UserLinks");

            migrationBuilder.RenameIndex(
                name: "IX_UserLink_UserId",
                table: "UserLinks",
                newName: "IX_UserLinks_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserLinks",
                table: "UserLinks",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserLinks_AspNetUsers_UserId",
                table: "UserLinks",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserLinks_AspNetUsers_UserId",
                table: "UserLinks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserLinks",
                table: "UserLinks");

            migrationBuilder.RenameTable(
                name: "UserLinks",
                newName: "UserLink");

            migrationBuilder.RenameIndex(
                name: "IX_UserLinks_UserId",
                table: "UserLink",
                newName: "IX_UserLink_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserLink",
                table: "UserLink",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserLink_AspNetUsers_UserId",
                table: "UserLink",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
