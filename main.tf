terraform {
  required_version = ">= 1.0.0"
}

variable "account_id" {
  type    = string
  default = "dummy_account_id"
}

output "nome_projeto" {
  value = "retro-rebelion"
}

output "branch_producao" {
  value = "main"
}

output "url" {
  value = "https://retro-rebelion.pages.dev"
}
