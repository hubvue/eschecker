#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

use std::collections::HashMap;

use napi::JsFunction;

#[napi(object)]
#[derive(Debug)]
pub struct Source {
  pub path: String,
  pub content: String,
}

#[napi(object)]
pub struct Node {
  pub kind: String,
}

#[napi(object)]
pub struct Problem {
  #[napi(js_name = "type")]
  pub problem_type: String,
  pub message: String,
}

#[napi(object)]
pub struct Config {
  #[napi(js_name = "esVersion")]
  pub es_version: u32,
  #[napi(ts_type = "Record<string, (node: Node)=>Array<Problem>>")]
  pub rules: HashMap<String, JsFunction>,
}

#[napi]
pub fn eschecker(sources: Vec<Source>, config: Config) -> Vec<Problem> {
  println!("sources: {:?}", sources);
  println!("config: {:?}", config.es_version);
  Vec::new()
}
