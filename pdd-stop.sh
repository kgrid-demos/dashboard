#!/bin/sh
pgrep -afl server
pkill -afl http-server
pkill -afl json-server
pgrep -afl server
